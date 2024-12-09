const rootRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return `
        <html>
          <head>
            <title>Nothing to see here</title>
            <style>
              body {
                background-color: #000;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            <h1>Nothing to see here</h1>
          </body>
        </html>
      `;
    },
    options: {
      auth: false // No authentication required for this route
    }
  }
];

module.exports = rootRoutes;