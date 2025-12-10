import { useState, useEffect, FormEvent } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Product, CartItem } from "@/types";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import Receipt from "@/Components/Receipt";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
}

interface PosPageProps extends PageProps {
  products: PaginatedProducts;
  categories: string[];
  settings?: {
    tax_enabled: boolean;
    tax_percentage: number;
  };
  filters: {
    search?: string;
    category?: string;
  };
}

export default function PosIndex({
  auth,
  products,
  categories,
  settings,
  filters,
}: PosPageProps) {
  const { flash } = usePage<any>().props;

  // State
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || "all"
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [pendingReceiptData, setPendingReceiptData] = useState<any>(null);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem("pos_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  // Handle receipt display after successful checkout
  useEffect(() => {
    if (flash?.lastTransaction && pendingReceiptData) {
      setReceiptData({
        id: flash.lastTransaction.id,
        items: pendingReceiptData.items.map((item: CartItem) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: pendingReceiptData.total,
        date: flash.lastTransaction.date,
        time: flash.lastTransaction.time,
      });
      setShowReceipt(true);
      setPendingReceiptData(null);
      sessionStorage.removeItem("pos_cart"); // Clear saved cart after successful checkout
    }
  }, [flash, pendingReceiptData]);

  // Add to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product_id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Cannot add more. Only ${product.stock} in stock!`);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stock === 0) {
        alert("Product out of stock!");
        return;
      }
      setCart((prev) => [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  // Update quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.data.find((p) => p.id === productId);
    if (product && quantity <= product.stock) {
      setCart((prev) =>
        prev.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    } else if (product) {
      alert(`Cannot set quantity. Only ${product.stock} in stock!`);
    }
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    if (confirm("Clear all items from cart?")) {
      setCart([]);
      sessionStorage.removeItem("pos_cart");
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    if (!settings?.tax_enabled) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (settings.tax_percentage / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Handle search
  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== "all") params.category = selectedCategory;

    router.get("/pos", params, { preserveState: true, preserveScroll: true });
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);

    const params: any = { category };
    if (searchQuery) params.search = searchQuery;

    router.get("/pos", params, { preserveState: true, preserveScroll: true });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    router.get("/pos", {}, { preserveState: true, preserveScroll: true });
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = calculateTotal();

    setPendingReceiptData({
      items: [...cart],
      total,
    });

    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    router.post(
      "/pos/checkout",
      {
        items,
        subtotal,
        tax,
        total,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setCart([]);
        },
        onError: (errors) => {
          console.error("Checkout errors:", errors);
          setPendingReceiptData(null);
        },
      }
    );
  };

  const hasActiveFilters =
    searchQuery || (selectedCategory && selectedCategory !== "all");

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800">Point of Sale</h2>
      }
    >
      <Head title="Point of Sale" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <form onSubmit={handleSearch} className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter Buttons */}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex flex-wrap gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryFilter("all")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                >
                  Search
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Results Info */}
            <div className="mt-3 text-xs text-gray-600">
              Showing {products.data.length} of {products.total} products
              {cart.length > 0 && (
                <span className="ml-2 font-semibold text-blue-600">
                  • {cart.length} items in cart
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            {products.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {products.data.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`bg-white border-2 rounded-lg p-3 text-left transition-all ${
                      product.stock === 0
                        ? "opacity-50 cursor-not-allowed border-gray-200"
                        : "hover:border-blue-500 hover:shadow-md border-gray-200"
                    }`}
                  >
                    {/* Product Image Placeholder */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category}
                    </p>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No products found</p>
              </div>
            )}

            {/* Pagination */}
            {products.last_page > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {products.current_page} of {products.last_page}
                  </div>
                  <div className="flex gap-2">
                    {products.links.map((link, index) => {
                      if (link.label === "&laquo; Previous") {
                        return (
                          <button
                            key={index}
                            onClick={() =>
                              link.url &&
                              router.get(
                                link.url,
                                {},
                                { preserveState: true, preserveScroll: true }
                              )
                            }
                            disabled={!link.url}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        );
                      }
                      if (link.label === "Next &raquo;") {
                        return (
                          <button
                            key={index}
                            onClick={() =>
                              link.url &&
                              router.get(
                                link.url,
                                {},
                                { preserveState: true, preserveScroll: true }
                              )
                            }
                            disabled={!link.url}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        );
                      }
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            link.url &&
                            router.get(
                              link.url,
                              {},
                              { preserveState: true, preserveScroll: true }
                            )
                          }
                          className={`px-3 py-1 border rounded-lg text-sm ${
                            link.active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {link.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg sticky top-4">
            {/* Cart Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Cart is empty</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click products to add
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 flex-1 line-clamp-2">
                          {item.product_name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            @Rp {item.price.toLocaleString("id-ID")}
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                {/* Subtotal, Tax & Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      Rp {calculateSubtotal().toLocaleString("id-ID")}
                    </span>
                  </div>

                  {settings?.tax_enabled && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tax ({settings.tax_percentage}%)
                      </span>
                      <span className="text-gray-900 font-medium">
                        Rp {calculateTax().toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {calculateTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-lg"
                >
                  Checkout ({cart.length} items)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <Receipt
          show={showReceipt}
          transactionId={receiptData.id}
          items={receiptData.items}
          total={receiptData.total}
          cashierName={auth.user.name}
          date={receiptData.date}
          time={receiptData.time}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </AuthenticatedLayout>
  );
}
