# Use Python 3.11
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your app code
COPY . .

# Expose the port Render expects (usually 10000)
EXPOSE 10000

# Start the app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]