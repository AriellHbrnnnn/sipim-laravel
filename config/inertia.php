<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Inertia Testing
    |--------------------------------------------------------------------------
    |
    | When running tests, Inertia will by default disable the view rendering
    | so your responses can be asserted against without worrying about the
    | HTML returned. However, you may want to enable this to test other
    | aspects of your application that may be affected by the HTML.
    |
    */

    'testing' => [
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('js/Pages'),
        ],
    ],

];
