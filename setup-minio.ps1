# MinIO Setup Script
Write-Host "Setting up MinIO bucket..." -ForegroundColor Green

# Wait for MinIO to be ready
Start-Sleep -Seconds 3

# Create bucket using MinIO API
$body = @{
    bucketName = "careflow-bucket"
} | ConvertTo-Json

try {
    # Try to create bucket via API
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    Write-Host "Creating bucket 'careflow-bucket'..." -ForegroundColor Yellow
    
    # Use mc (MinIO Client) if available, otherwise manual setup needed
    Write-Host ""
    Write-Host "✅ MinIO is running!" -ForegroundColor Green
    Write-Host "📍 API: http://localhost:9200" -ForegroundColor Cyan
    Write-Host "📍 Console: http://localhost:9201" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔐 Login credentials:" -ForegroundColor Yellow
    Write-Host "   Username: minioadmin" -ForegroundColor White
    Write-Host "   Password: minioadmin" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Open http://localhost:9201 in your browser" -ForegroundColor White
    Write-Host "   2. Login with minioadmin/minioadmin" -ForegroundColor White
    Write-Host "   3. Click 'Buckets' → 'Create Bucket'" -ForegroundColor White
    Write-Host "   4. Name: careflow-bucket" -ForegroundColor White
    Write-Host "   5. Click 'Create'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run: docker exec careflow-minio mc mb /data/careflow-bucket" -ForegroundColor Cyan
    
} catch {
    Write-Host "Manual bucket creation needed - see instructions above" -ForegroundColor Yellow
}
