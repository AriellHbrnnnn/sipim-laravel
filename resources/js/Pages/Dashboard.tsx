import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Calendar,
  Filter,
  X,
  Download,
} from "lucide-react";
import SalesChart from "@/Components/SalesChart";
import BestProductsChart from "@/Components/BestProductsChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DashboardStats {
  totalRevenue: number;
  totalProducts: number;
  totalTransactions: number;
  lowStockCount: number;
}

interface SalesChartData {
  date: string;
  revenue: number;
}

interface BestProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface CategoryStat {
  name: string;
  value: number;
}

interface RecentTransaction {
  id: number;
  cashier_name: string;
  total: number;
  date: string;
  time: string;
}

interface DashboardProps extends PageProps {
  stats: DashboardStats;
  salesChart: SalesChartData[];
  bestProducts: BestProduct[];
  categoryStats: CategoryStat[];
  recentTransactions: RecentTransaction[];
  filters: {
    filter_type: string;
    start_date: string;
    end_date: string;
  };
}

export default function Dashboard({
  auth,
  stats,
  salesChart,
  bestProducts,
  categoryStats,
  recentTransactions,
  filters,
}: DashboardProps) {
  const [filterType, setFilterType] = useState(
    filters.filter_type || "last_7_days"
  );
  const [startDate, setStartDate] = useState<Date | null>(
    filters.start_date ? new Date(filters.start_date) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.end_date ? new Date(filters.end_date) : null
  );
  const [showCustomDate, setShowCustomDate] = useState(
    filters.filter_type === "custom"
  );

  const handleFilterChange = (type: string) => {
    setFilterType(type);

    if (type === "custom") {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
      applyFilter(type);
    }
  };

  const applyFilter = (
    type: string = filterType,
    customStart: Date | null = null,
    customEnd: Date | null = null
  ) => {
    const params: any = { filter: type };

    if (type === "custom" && customStart && customEnd) {
      params.start_date = customStart.toISOString().split("T")[0];
      params.end_date = customEnd.toISOString().split("T")[0];
    }

    router.get("/dashboard", params, { preserveState: true });
  };

  const clearFilter = () => {
    setFilterType("last_7_days");
    setShowCustomDate(false);
    setStartDate(null);
    setEndDate(null);
    router.get(
      "/dashboard",
      { filter: "last_7_days" },
      { preserveState: true }
    );
  };

  const handleExportPdf = () => {
    const params = new URLSearchParams();
    params.append("filter", filterType);
    if (filterType === "custom" && startDate && endDate) {
      params.append("start_date", startDate.toISOString().split("T")[0]);
      params.append("end_date", endDate.toISOString().split("T")[0]);
    }
    window.open(`/dashboard/export-pdf?${params.toString()}`, "_blank");
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
      }
    >
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Welcome back, {auth.user.name}!
              </h3>
              <p className="text-sm text-gray-600">
                Here is what is happening with your store today.
              </p>
            </div>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Filter Period
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Quick Filter Buttons */}
            <button
              onClick={() => handleFilterChange("today")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "today"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilterChange("last_7_days")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "last_7_days"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleFilterChange("last_30_days")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "last_30_days"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => handleFilterChange("this_month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "this_month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => handleFilterChange("custom")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filterType === "custom"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Custom Range
            </button>

            {filterType !== "last_7_days" && (
              <button
                onClick={clearFilter}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Custom Date Range */}
          {showCustomDate && (
            <div className="mt-4 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  maxDate={endDate || undefined}
                  dateFormat="yyyy-MM-dd"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  minDate={startDate || undefined}
                  dateFormat="yyyy-MM-dd"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholderText="Select end date"
                />
              </div>
              <button
                onClick={() => {
                  if (startDate && endDate) {
                    applyFilter("custom", startDate, endDate);
                  } else {
                    alert("Please select both start and end dates");
                  }
                }}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          )}

          {/* Active Filter Display */}
          {filterType && (
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded">
              <strong>Active Filter:</strong>{" "}
              {filterType === "today" && "Today"}
              {filterType === "last_7_days" && "Last 7 Days"}
              {filterType === "last_30_days" && "Last 30 Days"}
              {filterType === "this_month" && "This Month"}
              {filterType === "custom" &&
                startDate &&
                endDate &&
                `${startDate.toLocaleDateString(
                  "id-ID"
                )} - ${endDate.toLocaleDateString("id-ID")}`}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12%
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-semibold text-gray-900">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +5%
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Products</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats.totalProducts}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="inline-flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8%
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Transactions</div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats.totalTransactions}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <span className="inline-flex items-center text-xs font-medium text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                Alert
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Low Stock Alert</div>
            <div className="text-2xl font-semibold text-red-600">
              {stats.lowStockCount}
            </div>
          </div>
        </div>

        {/* Sales Trend - FULL WIDTH */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <SalesChart data={salesChart} />
        </div>

        {/* Bottom Row - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best Products */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <BestProductsChart data={bestProducts} />
          </div>

          {/* Top Categories */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Categories
            </h3>
            {categoryStats.length > 0 ? (
              <div className="space-y-3">
                {categoryStats.map((category, index) => {
                  const maxValue = Math.max(
                    ...categoryStats.map((c) => c.value)
                  );
                  const percentage = (category.value / maxValue) * 100;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 truncate">
                          {category.name}
                        </span>
                        <span className="text-gray-900 font-semibold ml-2">
                          Rp {(category.value / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <Link
                href="/transactions"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Receipt className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Transaction #{transaction.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.cashier_name} • {transaction.date}{" "}
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      Rp {transaction.total.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions for selected period
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/pos"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">New Sale</div>
                <div className="text-sm text-gray-600">Process transaction</div>
              </div>
            </a>

            <a
              href="/products"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Manage Products</div>
                <div className="text-sm text-gray-600">Add or edit items</div>
              </div>
            </a>

            <a
              href="/transactions"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">View Reports</div>
                <div className="text-sm text-gray-600">Check sales data</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
