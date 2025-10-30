# MinIO Connection Problems - Diagnostic & Solutions

## 🔴 PROBLEMS IDENTIFIED

### Problem 1: Docker Container Exists But Not Running
**Error:** `The container name "/minio" is already in use`

**Cause:** You have a stopped MinIO container (ID: `fede2ffcf776`) that was created 4 hours ago but never started.

**Status:** Container is in "Created" state, not "Running"

---

### Problem 2: Port 9000 Access Forbidden
**Error:** `listen tcp 0.0.0.0:9000: bind: An attempt was made to access a socket in a way forbidden by its access permissions`

**Causes:**
- Port 9000 is reserved by Windows (Hyper-V, WSL2, or other services)
- Another process is using port 9000
- Windows firewall blocking the port

---

### Problem 3: MinIO Connection Refused (ECONNREFUSED)
**Error in API:** 
```json
{
    "success": false,
    "message": {
        "code": "ECONNREFUSED",
        "$metadata": {
            "attempts": 3,
            "totalRetryDelay": 57
        }
    }
}
```

**Cause:** Your Node.js app is trying to connect to `http://localhost:9000` but MinIO is NOT running.

**Configuration Issue:**
- `.env` file has: `S3_ENDPOINT=http://localhost:9000`
- But MinIO container is not started, so nothing is listening on port 9000

---

### Problem 4: Wrong Port Mapping in Docker Command
**Your command:**
```bash
docker run -p 9000:3000 -p 9001:3001 ...
```

**Issue:** You're mapping host port 9000 to container port 3000, but MinIO runs on port 9000 inside the container, not 3000.

**Correct mapping should be:** `-p 9000:9000 -p 9001:9001`

---

## ✅ SOLUTIONS

### Solution 1: Remove Old Container & Fix Port Conflict

```powershell
# Remove the existing broken container
docker rm minio

# Check what's using port 9000
netstat -ano | findstr :9000

# If something is using it, either:
# Option A: Kill that process (find PID from netstat, then):
# taskkill /PID <PID> /F

# Option B: Use different ports (recommended for Windows)
```

---

### Solution 2: Use Docker Compose (RECOMMENDED)

You already have `docker-compose.yaml` configured correctly. Use it instead:

```powershell
# Stop and remove any existing containers
docker-compose down -v

# Start MinIO with docker-compose
docker-compose up -d minio

# Verify it's running
docker-compose ps

# Check logs
docker-compose logs minio
```

**Why this works:**
- Docker Compose handles port conflicts better
- Your `docker-compose.yaml` is already configured correctly
- Easier to manage multiple services

---

### Solution 3: Alternative Ports (If Port 9000 is Blocked)

If port 9000 is permanently blocked by Windows, modify your setup:

**Option A: Change ports in docker-compose.yaml**
```yaml
ports:
  - "9002:9000"  # Map host 9002 to container 9000
  - "9003:9001"  # Map host 9003 to container 9001
```

**Then update .env:**
```env
S3_ENDPOINT=http://localhost:9002
```

**Option B: Use manual docker run with different ports**
```powershell
docker rm minio
docker run -d \
  -p 9002:9000 \
  -p 9003:9001 \
  --name minio \
  -v c:/Users/Youcode/Desktop/2ème\ annèe/CareFlow/minio-data:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  quay.io/minio/minio server /data --console-address ":9001"
```

---

### Solution 4: Create MinIO Bucket

After MinIO is running, you need to create the bucket:

```powershell
# Access MinIO Console
# Open browser: http://localhost:9001
# Login: minioadmin / minioadmin
# Create bucket named: careflow-bucket
```

**Or use MinIO client (mc):**
```powershell
# Install mc (MinIO Client)
# Then:
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/careflow-bucket
```

---

## 🚀 STEP-BY-STEP FIX (RECOMMENDED)

### Step 1: Clean Up
```powershell
cd "C:\Users\Youcode\Desktop\2ème annèe\CareFlow"
docker-compose down -v
docker rm -f minio 2>$null
```

### Step 2: Start MinIO
```powershell
docker-compose up -d minio
```

### Step 3: Verify MinIO is Running
```powershell
docker-compose ps
# Should show: careflow-minio running

docker-compose logs minio
# Should show: MinIO started successfully
```

### Step 4: Create Bucket
- Open browser: http://localhost:9001
- Login: `minioadmin` / `minioadmin`
- Click "Buckets" → "Create Bucket"
- Name: `careflow-bucket`
- Click "Create"

### Step 5: Test Your API
```powershell
# Your Node.js app should now connect successfully
# Test the upload endpoint:
# POST http://localhost:8000/api/lab-orders/6900c262b888c7c3f83b7887/upload-result
```

---

## 🔍 VERIFICATION CHECKLIST

- [ ] MinIO container is running: `docker ps | findstr minio`
- [ ] Port 9000 is accessible: `curl http://localhost:9000/minio/health/live`
- [ ] MinIO console accessible: Open http://localhost:9001
- [ ] Bucket exists: Check in MinIO console
- [ ] .env has correct endpoint: `S3_ENDPOINT=http://localhost:9000`
- [ ] API can connect: Test upload endpoint

---

## 📝 CONFIGURATION SUMMARY

**Current .env (correct for localhost):**
```env
S3_BUCKET=careflow-bucket
S3_KEY=minioadmin
S3_SECRET=minioadmin
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
```

**Docker Compose (already correct):**
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001
- Container name: careflow-minio

---

## ⚠️ COMMON MISTAKES TO AVOID

1. ❌ Don't use `docker run` manually when you have docker-compose
2. ❌ Don't map wrong ports: `-p 9000:3000` is WRONG
3. ❌ Don't forget to create the bucket after starting MinIO
4. ❌ Don't use `http://minio:9000` in .env (that's for container-to-container)
5. ❌ Don't start app before MinIO is ready

---

## 🐛 DEBUGGING COMMANDS

```powershell
# Check if MinIO is running
docker ps | findstr minio

# Check MinIO logs
docker logs careflow-minio

# Check what's using port 9000
netstat -ano | findstr :9000

# Test MinIO health
curl http://localhost:9000/minio/health/live

# Check MinIO from inside container
docker exec careflow-minio curl http://localhost:9000/minio/health/live

# Restart MinIO
docker-compose restart minio
```

---

## 📊 ERROR CODE MEANINGS

| Error | Meaning | Solution |
|-------|---------|----------|
| ECONNREFUSED | MinIO not running | Start MinIO container |
| Port bind error | Port already in use | Use different port or kill process |
| Container name conflict | Old container exists | Remove old container |
| 404 Bucket not found | Bucket doesn't exist | Create bucket in console |
| 403 Access Denied | Wrong credentials | Check S3_KEY/S3_SECRET |

---

## 🎯 QUICK FIX (Copy-Paste)

```powershell
# Run these commands in order:
cd "C:\Users\Youcode\Desktop\2ème annèe\CareFlow"
docker rm -f minio
docker-compose up -d minio
timeout /t 5
echo "MinIO started. Now open http://localhost:9001 and create bucket 'careflow-bucket'"
```

Then manually create the bucket in the web console.

---

## 📞 STILL NOT WORKING?

If MinIO still doesn't start:

1. Check Windows Hyper-V port reservations:
   ```powershell
   netsh interface ipv4 show excludedportrange protocol=tcp
   ```

2. If port 9000 is reserved, use alternative ports (9002/9003)

3. Check Docker Desktop is running

4. Try restarting Docker Desktop

5. Check firewall settings for Docker
