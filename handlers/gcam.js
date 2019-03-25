const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;

var request = require('request');
const JSDOM = require('jsdom')

class GcamController extends TelegramBaseController {

    search($) {

        var kb = {
            inline_keyboard: []
        };

        if (!$.command.success || $.command.arguments.length === 0) {

            request.get("https://www.celsoazevedo.com/files/android/google-camera/developers/", function (error, response, body) {
                var devs = new JSDOM.JSDOM(body);
                var links = devs.window.document.querySelectorAll(".devspost a");

                var msg = "";
                for (var i = 0; i < links.length; i++) {
                    if (links[i].textContent.indexOf("Others") !== -1)
                        break;
                    msg += links[i].textContent + " ";
                }

                $.sendMessage("I need a gcam dev name.\n `" + msg + "`", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });

                return

            });

            return;
        }

        request.get("https://www.celsoazevedo.com/files/android/google-camera/", function (error, response, body) {
            var dom = new JSDOM.JSDOM(body);


            var msg = "🔍 *GCam Search Result(s):*";

            var plop = dom.window.document.querySelectorAll(".listapks li [class*=\"" + $.command.arguments[0] + "\"]");

            if (!plop || plop.length === 0) {
                $.sendMessage("🔍 *No results found matching your query* \n", {
                    parse_mode: "markdown",
                    reply_to_message_id: $.message.messageId
                });
                return;
            }

            var length = plop.length < 5 ? plop.length : 5;
            for (var i = 0; i < length; i++) {
                var link = plop[i].parentNode.querySelectorAll("a");

                var apkNote = plop[i].parentNode.querySelector(".apknote");

                var gcamName = link[0].textContent;

                msg += "\n [" + gcamName + "](" + link[0].href + ")";

                if (link[1])
                    msg += " *|* [" + link[1].textContent + "](" + link[1].href + ")";

                if (link[2])
                    msg += " *|* [" + link[2].textContent + "](" + link[2].href + ")";

                if (apkNote)
                    msg += " *|* for " + apkNote.textContent + "";

                msg += ""
            }

            $.sendMessage(msg, {
                disable_web_page_preview: true,
                reply_to_message_id: $.message.messageId,
                parse_mode: "markdown"
            });
        });
    }

    get routes() {
        return {
            'gcamHandler': 'search',
        }
    }
}



module.exports = GcamController;
