/* Musicated Records — Live stage
   The Live page never shows a raw YouTube error. By default it renders a
   designed "not live right now" panel; pressing play swaps in the real
   channel-live player, so if Eric IS on air it starts inline.

   ONE THING TO SET: the channel id on <div class="stage" data-yt-channel="...">
   in live.html. It is deliberately EMPTY until Eric's real channel is known —
   the previous build shipped YouTube's own corporate channel id, which meant the
   player could never have shown his stream. While it is empty the panel simply
   shows the schedule and hides the buttons, which is honest. Fill it in and the
   play button and subscribe link light up on their own.

   Channel id looks like UCxxxxxxxxxxxxxxxxxxxxxx — YouTube Studio >
   Settings > Channel > Advanced settings.
*/
(function () {
  "use strict";

  var stage = document.querySelector(".stage");
  if (!stage) return;

  var channel = (stage.getAttribute("data-yt-channel") || "").trim();
  var playBtn = stage.querySelector(".stage__play");
  var subLink = stage.querySelector(".stage__sub");
  var note = stage.querySelector(".stage__note");

  if (!channel) {
    // No channel wired up yet — leave the panel in its honest, button-less state.
    if (note) {
      note.textContent =
        "Streams go out on YouTube. Follow the socials below for the bell.";
    }
    return;
  }

  var chanUrl = "https://www.youtube.com/channel/" + channel;
  if (subLink) {
    subLink.href = chanUrl + "?sub_confirmation=1";
    subLink.hidden = false;
  }
  if (playBtn) {
    playBtn.hidden = false;
    playBtn.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src =
        "https://www.youtube.com/embed/live_stream?channel=" +
        encodeURIComponent(channel) +
        "&autoplay=1";
      frame.title = "Musicated Records — live";
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      frame.setAttribute("allowfullscreen", "");
      frame.className = "stage__frame";
      stage.replaceWith(frame);
    });
  }
})();
