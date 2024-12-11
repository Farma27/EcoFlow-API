const rootRoutes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return `
        <html>
          <head>
            <title>Nothing to see here</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: white;
                color: black;
              }
              .button-container {
                position: absolute;
                top: 20px;
                right: 20px;
              }
              button {
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                background: none;
                border: none;
                color: inherit;
              }
              button i {
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <div class="button-container">
              <button onclick="toggleColors()">
                <i class="fas fa-adjust"></i>
              </button>
            </div>
            <h1>Nothing to see here</h1>
            <script>
              function toggleColors() {
                const body = document.body;
                if (body.style.backgroundColor === 'black') {
                  body.style.backgroundColor = 'white';
                  body.style.color = 'black';
                } else {
                  body.style.backgroundColor = 'black';
                  body.style.color = 'white';
                }
              }
            </script>
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