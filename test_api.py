import requests
import json

BASE_URL = "http://localhost:5000/api/articles"

def test_apis():
    print("--- Starting API Tests ---")

    # 1. Create a sample article
    sample_article = {
        "title": "Test Article",
        "slug": "test-article",
        "content": "This is a test article content.",
        "sourceUrl": "https://example.com/test",
        "isUpdated": False
    }
    
    print("\n1. Testing POST /api/articles...")
    try:
        response = requests.post(BASE_URL, json=sample_article)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        article_id = response.json().get('data', {}).get('_id')
    except Exception as e:
        print(f"Error creating article: {e}")
        return

    # 2. Get all articles
    print("\n2. Testing GET /api/articles...")
    response = requests.get(BASE_URL)
    print(f"Status: {response.status_code}")
    print(f"Count: {response.json().get('count')}")

    if article_id:
        # 3. Get single article
        print(f"\n3. Testing GET /api/articles/{article_id}...")
        response = requests.get(f"{BASE_URL}/{article_id}")
        print(f"Status: {response.status_code}")

        # 4. Update article
        print(f"\n4. Testing PUT /api/articles/{article_id}...")
        update_data = {"title": "Updated Test Article"}
        response = requests.put(f"{BASE_URL}/{article_id}", json=update_data)
        print(f"Status: {response.status_code}")
        print(f"Updated Title: {response.json()['data']['title']}")

        # 5. Delete article
        print(f"\n5. Testing DELETE /api/articles/{article_id}...")
        response = requests.delete(f"{BASE_URL}/{article_id}")
        print(f"Status: {response.status_code}")

    print("\n--- API Tests Completed ---")

if __name__ == "__main__":
    test_apis()
