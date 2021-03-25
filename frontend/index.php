<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="./styles.css" />
    <title>Document</title>
</head>
<body>
    <main>
        <div style="display: flex;margin-left: 25%;">
        <h1>Welcome to Youtube Trending videos</h1>
        <button style="margin-left: 25%;margin-top: 5%; height: 20px;" id="btnrefresh">Refresh</button>
    </div>
        <div class="video_card_grid" id="video_card_grid">
        </div>
    </main>
    <script src="./video.js"></script>
</body>
</html>