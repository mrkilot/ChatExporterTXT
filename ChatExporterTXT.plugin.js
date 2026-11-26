/**
 * @name ChatExporterTXT
 * @author mrkilot
 * @authorLink https://github.com/mrkilot
 * @description Exports channel or PM messages to TXT with a choice of save folder.
 * @version 3.5.0
 * @website https://github.com/ChatExporterTXT
 * @source https://github.com/ChatExporterTXT/blob/main/ChatExporterTXT.plugin.js
 */

module.exports = class ChatExporterTXT {
    constructor() {
        this.unpatchChannel = null;
        this.unpatchDM = null;
        this.capturedToken = null;
        this.origSetHeader = null;
    }

    start() {
        const { ContextMenu, UI, Webpack, Net } = BdApi;
        const ChannelStore = Webpack.getStore?.("ChannelStore") || Webpack.getByKeys("getChannel", "getDMFromUserId");
        const MessageActions = Webpack.getByKeys("fetchMessages", "sendMessage");
        const fetcher = Net?.fetch || window.fetch.bind(window);
        const origin = window.location.origin || "https://discord.com";

        const self = this;
        this.origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (header?.toLowerCase() === "authorization" && typeof value === "string" && value.length > 20 && !value.startsWith("Bot ")) {
                self.capturedToken = value;
            }
            return self.origSetHeader.apply(this, arguments);
        };

        const resolveToken = async (channelId) => {
            if (this.capturedToken) return this.capturedToken;

            try {
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                document.body.appendChild(iframe);
                const raw = iframe.contentWindow?.localStorage?.getItem("token");
                document.body.removeChild(iframe);
                if (raw) {
                    this.capturedToken = raw.replace(/^"|"$/g, "");
                    return this.capturedToken;
                }
            } catch {}

            if (MessageActions?.fetchMessages && channelId) {
                try {
                    await MessageActions.fetchMessages({ channelId, limit: 1 });
                    await new Promise(r => setTimeout(r, 400));
                } catch {}
            }

            return this.capturedToken;
        };

        const fetchBatch = async (channelId, beforeId, token) => {
            const url = `${origin}/api/v9/channels/${channelId}/messages?limit=100${beforeId ? `&before=${beforeId}` : ""}`;
            const res = await fetcher(url, {
                method: "GET",
                headers: { "Authorization": token }
            });
            if (res.status === 429) {
                const data = await res.json();
                throw { status: 429, retryAfter: data.retry_after || 2 };
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        };

        const exportMessages = async (channelId, name) => {
            if (!channelId) return UI.showToast("Не найден ID чата.", { type: "error" });
            UI.showToast(`Выгружаю ${name}...`, { type: "info" });

            const token = await resolveToken(channelId);
            if (!token) {
                return UI.showToast("Переключитесь на любой другой канал и обратно, затем повторите.", { type: "warning" });
            }

            let all = [];
            let lastId;

            try {
                while (true) {
                    let msgs;
                    try {
                        msgs = await fetchBatch(channelId, lastId, token);
                    } catch (e) {
                        if (e?.status === 429) {
                            await new Promise(r => setTimeout(r, (e.retryAfter || 2) * 1000));
                            continue;
                        }
                        throw e;
                    }
                    if (!Array.isArray(msgs) || msgs.length === 0) break;
                    all.push(...msgs);
                    lastId = msgs[msgs.length - 1].id;
                    await new Promise(r => setTimeout(r, 350));
                }

                if (all.length === 0) {
                    return UI.showToast("Сообщений не найдено.", { type: "warning" });
                }

                all.reverse();
                const text = all.map(m => {
                    const date = new Date(m.timestamp).toLocaleString("ru-RU");
                    const author = m.author?.global_name || m.author?.username || "User";
                    const files = m.attachments?.length ? "\n  [Файлы]: " + m.attachments.map(a => a.url).join(", ") : "";
                    return `[${date}] ${author}: ${m.content || ""}${files}`;
                }).join("\n");

                const fileName = `chat_${(name || channelId).replace(/[\\/:*?"<>|]/g, "_")}.txt`;

                if (window.DiscordNative?.fileManager?.saveWithDialog) {
                    await window.DiscordNative.fileManager.saveWithDialog(new TextEncoder().encode(text), fileName);
                    UI.showToast(`Сохранено сообщений: ${all.length}`, { type: "success" });
                } else {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
                    a.download = fileName;
                    a.click();
                    UI.showToast(`Сохранено в Загрузки: ${all.length}`, { type: "success" });
                }
            } catch (err) {
                if (err?.name !== "AbortError") {
                    UI.showToast(`Ошибка: ${err?.message || err?.status || "сбой"}`, { type: "error" });
                }
            }
        };

        this.unpatchChannel = ContextMenu.patch("channel-context", (tree, props) => {
            if (!props?.channel) return;
            tree.props.children.push(ContextMenu.buildItem({
                label: "Экспортировать чат в TXT",
                id: "export-chat-txt",
                action: () => exportMessages(props.channel.id, props.channel.name)
            }));
        });

        this.unpatchDM = ContextMenu.patch("user-context", (tree, props) => {
            const id = props?.channel?.id || (props?.user?.id && ChannelStore?.getDMFromUserId?.(props.user.id));
            if (!id) return;
            tree.props.children.push(ContextMenu.buildItem({
                label: "Экспортировать ЛС в TXT",
                id: "export-dm-txt",
                action: () => exportMessages(id, props.user?.username)
            }));
        });
    }

    stop() {
        if (this.origSetHeader) {
            XMLHttpRequest.prototype.setRequestHeader = this.origSetHeader;
        }
        this.unpatchChannel?.();
        this.unpatchDM?.();
    }
};
