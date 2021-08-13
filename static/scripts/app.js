function onSendToServer() {
  var text = document.getElementById("txtInput").value;
  var sendButton = document.getElementById("btnSend");
  var out = document.getElementById("result");

  entry = {
    text: text,
  };

  sendButton.disabled = true;
  sendButton.innerHTML = '<span class="sr-only">Loading..</span>';
  out.innerHTML = "";
  url = "/analyze-sdk";

  fetch(url, {
    method: "POST",
    body: JSON.stringify(entry),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then(function (response) {
      sendButton.disabled = false;
      sendButton.innerHTML = '<span class="sr-only">Review</span>';
      response.json().then(function (data) {
        var err = data["error"];
        if (err) {
          out.innerHTML = "Error fetching data : " + err["message"];
        } else {
          setSentiment(data, out);
        }
      });
    })
    .catch(function (error) {
      out.innerHTML = "Error while fetching the data";
      sendButton.disabled = false;
      sendButton.innerHTML = '<span class="sr-only">Review</span>';
    });
}

function setSentiment(data, out) {
  var sentiment = data["sentiment"];
  if (sentiment == "neutral") {
    out.innerHTML =
      "Sentiment predicted: <span class='text-primary'>Neutral</span>";
  } else if (sentiment == "positive") {
    out.innerHTML =
      "Sentiment predicted: <span class='text-success'>Positive</span>.";
  } else if (sentiment == "negative") {
    out.innerHTML =
      "Sentiment predicted: <span class='text-danger'>Negative</span>";
  } else {
    out.innerHTML =
      "Sentiment predicted: <span class='text-warning'>Mixed</span>";
  }
  
}
