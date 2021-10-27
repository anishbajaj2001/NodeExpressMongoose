console.log("script connected.")

var heart_status = 0 // 0 is empty and 1 is filled.

document.getElementById("heart-button").addEventListener("click", () => {
    let heart = document.getElementById("heart-button");
    if (heart_status == 0) {
        heart.src = "static/heart-filled.png"
        heart_status = 1
        // TODO: update the database and mark this image as a favorite image.
        let image_url = document.getElementById("apod-image").getAttribute("src");
        let image_title = document.getElementById("apod-title").innerHTML;
        let image_date = document.getElementById("apod-date").innerHTML;
        let image_description = document.getElementById("apod-p").innerHTML;
        let image_fav = heart_status;

        var xhr = new XMLHttpRequest();
        var url = "/api/images";
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-Type", "application/json");

        var data = JSON.stringify({
            "content": "new favorite image",
            "url": image_url,
            "title": image_title,
            "date": image_date,
            "description": image_description,
            "fav": image_fav
        });

        xhr.send(data);
    } else {
        heart_status = 0
        heart.src = "static/heart.png"
        let image_url = document.getElementById("apod-image").getAttribute("src");
        let image_fav = heart_status;
        // TODO: update the database and un-mark this image as a favorite image.
        var xhr = new XMLHttpRequest();
        var url = "/api/images/update";
        xhr.open("PUT", url, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({
            "url": image_url,
            "fav": image_fav
        });
        xhr.send(data);
    }
})

document.getElementById("next-button").addEventListener("click", () => {
    document.getElementById("heart-button").src = "static/heart.png";
    heart_status = 0
    // TODO: Get the image url, title, description, and date from the database using Fetch.
    // you can use let date = document.getElementById("apod-date"); to change the date.
    var xhr = new XMLHttpRequest();
    var url = "/api/get-random";
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    let image_date = document.getElementById("apod-date").innerHTML;
    var data = JSON.stringify({
        "date": image_date,
    });
    xhr.send(data);
    var jsonResponse = JSON.parse(xhr.response);
    document.getElementById("apod-date").innerHTML = jsonResponse["date"];
    document.getElementById("apod-image").src = jsonResponse["url"];
    document.getElementById("apod-title").innerHTML = jsonResponse["title"];
    document.getElementById("apod-p").src = jsonResponse["description"];
    document.getElementById("heart-button").src = jsonResponse["fav"] == 1 ? "static/heart-filled.png" : "static/heart.png";
})