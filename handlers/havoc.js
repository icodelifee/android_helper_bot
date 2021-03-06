const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController;
const BotUtils = require('../utils')

class HavocController extends TelegramBaseController {

    triggerCommand($) {
        BotUtils.getRomFilter($, this.searchBuild)
    }


    searchBuild($) {

        if (!$.command.success || $.command.arguments.length === 0) {
            $.sendMessage("Usage: /havoc device", {
                parse_mode: "markdown",
                reply_to_message_id: $.message.messageId
            });
            return;
        }

        var device = $.command.arguments[0];

        BotUtils.getSourceForgeBuilds($, HavocController.romInfos(), device);

    }

    static romInfos() {
        return {
            fullName: "HavocOS",
            extraSFPath: "{0}",
            projectName: "havoc-os",
            website: ""
        }
    }

    get routes() {
        return {
            'havocBuildHandler': 'triggerCommand',
        }
    }
}



module.exports = HavocController;
