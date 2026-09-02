$urls = @(
    "http://localhost:8080/styles.css",
    "http://localhost:8080/js/app.js",
    "http://localhost:8080/js/products.js",
    "http://localhost:8080/js/currency.js",
    "http://localhost:8080/js/cart.js",
    "http://localhost:8080/js/order-pdf.js",
    "http://localhost:8080/logos/WAOU%20Logo%20rojo.svg",
    "http://localhost:8080/logos/WAOU%20Logo%20blanco.svg",
    "http://localhost:8080/Imagenes/polef1.jpg",
    "http://localhost:8080/Imagenes/Diffsize.jpg"
)

foreach ($url in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing
        Write-Host "$url : $($res.StatusCode) ($($res.RawContentLength) bytes)"
    } catch {
        Write-Host "$url : ERROR - $($_.Exception.Message)"
    }
}
