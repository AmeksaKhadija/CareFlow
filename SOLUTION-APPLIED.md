# ✅ MinIO Solution Applied Successfully

## 🎉 PROBLEM FIXED!

Your MinIO is now running successfully on alternative ports.

---

## 📋 What Was Done

### 1. Removed Old Container
```powershell
docker rm -f minio
```

### 2. Identified Port Conflict
Windows had reserved ports 8950-9149, which included your original ports 9000-9001.

### 3. Changed to Safe Ports
- **Old:** 9000 (API) and 9001 (Console) - BLOCKED by Windows
- **New:** 9200 (API) and 9201 (Console) - WORKING ✅

### 4. Updated Configuration Files

**docker-compose.yaml:**
```yaml
ports:
  - "9200:9000"  # API
  - "9201:9001"  # Console
```

**.env:**
```env
S3_ENDPOINT=http://localhost:9200
```

### 5. Started MinIO
```powershell
docker-compose up -d minio
```

---

## 🚀 MinIO is Now Running

**Status:** ✅ UP and HEALTHY

**Access Points:**
- 🔌 **API Endpoint:** http://localhost:9200
- 🖥️ **Web Console:** http://localhost:9201

**Credentials:**
- Username: `minioadmin`
- Password: `minioadmin`

---

## 📝 NEXT STEP: Create Bucket

You need to create the bucket `careflow-bucket` before uploading files.

### Option 1: Web Console (Easiest)
1. Open http://localhost:9201 in your browser
2. Login with `minioadmin` / `minioadmin`
3. Click **"Buckets"** → **"Create Bucket"**
4. Enter name: `careflow-bucket`
5. Click **"Create"**

### Option 2: Command Line
```powershell
docker exec careflow-minio mkdir -p /data/careflow-bucket
```

---

## 🧪 Test Your API

After creating the bucket, test your upload endpoint:

```bash
POST http://localhost:8000/api/lab-orders/6900c262b888c7c3f83b7887/upload-result
```

**Expected Result:** ✅ File uploaded successfully (no more ECONNREFUSED error)

---

## 📊 Verification Commands

```powershell
# Check MinIO is running
docker ps | findstr minio

# Check logs
docker-compose logs minio

# Check health
curl http://localhost:9200/minio/health/live

# List containers
docker-compose ps
```

---

## 🔧 Current Configuration

**.env file:**
```env
PORT=8000
MONGO_URL=mongodb+srv://...
TOKEN_SECRET=secret
S3_BUCKET=careflow-bucket
S3_KEY=minioadmin
S3_SECRET=minioadmin
S3_ENDPOINT=http://localhost:9200  ← UPDATED
S3_REGION=us-east-1
```

**docker-compose.yaml:**
```yaml
services:
  minio:
    image: minio/minio:latest
    container_name: careflow-minio
    ports:
      - "9200:9000"  ← UPDATED
      - "9201:9001"  ← UPDATED
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
```

---

## ⚠️ Important Notes

1. **Always use port 9200** for API connections (not 9000)
2. **Console is on port 9201** (not 9001)
3. **Bucket must be created** before first upload
4. **MinIO data persists** in Docker volume `minio_data`

---

## 🔄 Restart Commands

If you need to restart MinIO:

```powershell
# Restart
docker-compose restart minio

# Stop
docker-compose stop minio

# Start
docker-compose start minio

# Full restart (removes containers)
docker-compose down
docker-compose up -d minio
```

---

## ✅ Success Checklist

- [x] Old container removed
- [x] Port conflict resolved (using 9200/9201)
- [x] docker-compose.yaml updated
- [x] .env file updated
- [x] MinIO container running
- [ ] **Bucket created** ← DO THIS NOW
- [ ] API tested

---

## 🎯 Summary

**Problem:** Port 9000 was reserved by Windows, MinIO couldn't start

**Solution:** Changed to ports 9200 (API) and 9201 (Console)

**Status:** ✅ FIXED - MinIO is running

**Next:** Create bucket `careflow-bucket` via http://localhost:9201

---

## 📞 If Issues Persist

1. Check Docker Desktop is running
2. Verify ports: `netstat -ano | findstr :9200`
3. Check logs: `docker-compose logs minio`
4. Restart: `docker-compose restart minio`

---

**Your MinIO is ready! Just create the bucket and start uploading files! 🚀**
