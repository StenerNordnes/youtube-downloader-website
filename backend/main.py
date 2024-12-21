from pytubefix import YouTube

yt = YouTube(
    "https://www.youtube.com/watch?v=1ZHegoSlXZk&list=RD1ZHegoSlXZk&start_radio=1"
)

print(yt.title)
