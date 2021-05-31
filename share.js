window.addEventListener('click', function (e) {

    var button = null;
    if(e.target && e.target.nodeName == "BUTTON") button = $(e.target);
    else if(e.target.parentNode && e.target.parentNode.nodeName == "BUTTON") button = $(e.target.parentNode);
    if(!button) return;

    buttonId = $(button).attr("id");
    if(!buttonId || !buttonId.startsWith("sharetip-")) return;

    e.preventDefault();

    var text = $("#sharetip").attr("data-content").trim();
    if(text) {

        var first = text.charAt(0);
        if (first === first.toLowerCase() && first !== first.toUpperCase())
            text  = "[..] " + text;

        var last = text.charAt(text.length-1);
        if (!last.endsWith("."))
            text += " [..]";

        text = "\"" + text + "\"";
    }

    app_id = button.attr("data-id");
    switch(buttonId) {

        case 'sharetip-twitter':
            window.open("https://twitter.com/intent/tweet?text="+text+"&url="+window.location, '_blank');
        break;
        case 'sharetip-facebook':
            window.open("https://www.facebook.com/sharer/sharer.php?quote="+text+"&u="+window.location, '_blank');
        break;
        case 'sharetip-copy':

            $(document).bind('copy', (event) => {
                    event.clipboardData.setData('text/plain', text+"\n"+window.location);
                    event.preventDefault();
            });

            document.execCommand("copy");
        break;

        case 'sharetip-email':

            window.location = "mailto:"+
                "?subject="+document.title+
                "&body="+text+"%0D%0A"+window.location;
            break;

        default: console.error("Service not found.");
    }

    window.getSelection().removeAllRanges();
    $("#sharetip").each(function() {
        this.remove();
    });
});

window.addEventListener('mouseup', function (e) {

    if (typeof window.getSelection == 'undefined') return;

    var selection = window.getSelection();
    if(!selection) return;
    if(selection.rangeCount < 1) return;

    var range     = selection.getRangeAt(0);
    if(!range) return;

    var parent    = range.commonAncestorContainer ? range.commonAncestorContainer :
                    range.parentElement ? range.parentElement() :
                    range.item(0);

    var text      = selection.toString();
    if(text == undefined || text == "" || $(parent).closest("form").length) {
        $("#sharetip").each(function() {
            this.remove();
        });
        return;
    }

    var sharetip = $("#sharetip");
    if(sharetip && sharetip.attr("data-content") == text) return;
    $("#sharetip").each(function() {
        this.remove();
    });

    var mouse = {
        x:e.clientX+window.scrollX,
        y:e.clientY+window.scrollY
    };

    sharetip = document.createElement("div");
        $(sharetip).attr("id", "sharetip");
        $(sharetip).attr("data-content", text);
        $(sharetip).css("position", "absolute");
        $(sharetip).css("left", mouse.x);
        $(sharetip).css("top", mouse.y);
        $(sharetip).append(getLinks());

    var links = $(sharetip).find("ul");

    links.attr("style", "background-color: "+getRandomColor("0123456789ABC", 0.8)+";");
    $("body").append(sharetip);

}, false);

function getRandomColor(letters = '0123456789ABCDEF', alpha = 1) {

	var color = '#';

	for (var i = 0; i < 6; i++)
		color += letters[Math.floor(Math.random() * letters.length)];

	alpha = letters[Math.floor(alpha * letters.length)];

	return color + alpha + alpha;
}


function getHttp(url)
{
    var xmlHttp = $.get(url)

	var htmlResponse = document.createElement("html");
	$(htmlResponse)[0].innerHTML = xmlHttp.responseText;


	console.log(xmlHttp.responseText);
    return htmlResponse;
}

function htmlentities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getLinks()
{
    var list = document.createElement("ul");
        list.innerHTML  = "<li><button id='sharetip-twitter'><i class='fab fa-twitter'></button></li>";
        list.innerHTML += "<li><button id='sharetip-facebook'><i class='fab fa-facebook'></button></li>";
        list.innerHTML += "<li><button id='sharetip-copy'><i class='fas fa-paperclip'></i></button></li>";
        list.innerHTML += "<li><button id='sharetip-email'><i class='fas fa-at'></button></li>";

    return list;
}