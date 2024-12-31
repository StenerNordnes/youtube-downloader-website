from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from pytubefix import YouTube
import uvicorn
import os


def delete_oldest_download():
    downloads = os.listdir("downloads")
    print("Number of files:", len(downloads))
    if len(downloads) > 5:
        oldest = sorted(downloads, key=lambda x: os.path.getctime(f"downloads/{x}"))[0]
        os.remove(f"downloads/{oldest}")
        print(f"Deleted {oldest}")
    else:
        print("No files to delete")


app = FastAPI()


@app.post("/api/download")
async def download_video(request: Request):
    body = await request.json()
    url = body.get("url")
    yt = YouTube(url)

    if not os.path.exists("downloads"):
        os.makedirs("downloads")

    yt.streams.filter(progressive=True, file_extension="mp4").order_by(
        "resolution"
    ).desc().first().download("downloads")

    delete_oldest_download()

    return {
        "status": "success",
        "download_link": f"/api/video/{yt.title}.mp4",
        "title": yt.title,
        "thumbnail": yt.thumbnail_url,
        "duration": yt.length,
    }


@app.get("/api/video/{video_name}")
async def get_video(video_name: str):
    try:
        res = FileResponse(f"downloads/{video_name}", media_type="video/mp4")
    except FileNotFoundError:
        return {"status": "error", "message": "File not found"}

    return res


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
