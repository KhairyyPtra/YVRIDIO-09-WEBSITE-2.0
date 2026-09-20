import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ArrowDownAZ,
  ArrowUp,
  BookOpen,
  BriefcaseBusiness,
  Broom,
  Cake,
  Camera,
  ChevronLeft,
  ChevronRight,
  ClipboardPenLine,
  CreditCard,
  Crown,
  GraduationCap,
  Mail,
  MapPin,
  Music2,
  Play,
  Radio,
  Rocket,
  Shield,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Telescope,
  Toolbox,
  UserRound,
  Volume2,
  X
} from "lucide-react";

const ICONS = {
  "👨🏻‍🎓": GraduationCap,
  "👔": BriefcaseIcon,
  "🌌": Telescope,
  "🚀": Rocket,
  "✦": Sparkles,
  "📸": Camera,
  "📧": Mail,
  "🎂": Cake,
  "👑": Crown,
  "📝": ClipboardPenLine,
  "💳": CreditCard,
  "📚": BookOpen,
  "📡": Radio,
  "🛡️": Shield,
  "🧰": Toolbox,
  "🧹": Broom,
  "🔠": ArrowDownAZ,
  "🎲": Shuffle,
  "♫": Music2,
  "⏮": SkipBack,
  "▶": Play,
  "⏭": SkipForward,
  "✕": X,
  "‹": ChevronLeft,
  "›": ChevronRight,
  "↑": ArrowUp,
  "👤": UserRound,
  "📍": MapPin,
  "🎵": Music2,
  "🔊": Volume2,
  "🌠": Sparkles
};

function BriefcaseIcon(props) {
  return <BriefcaseBusiness {...props} />;
}

function iconMarkup(Icon) {
  return renderToStaticMarkup(
    <Icon className="ui-icon-svg" aria-hidden="true" strokeWidth={1.8} />
  );
}

const iconTokens = Object.keys(ICONS).sort((a, b) => b.length - a.length);
const tokenPattern = new RegExp(iconTokens.map(escapeRegExp).join("|"), "gu");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceTextNode(textNode) {
  if (!textNode.nodeValue || textNode.parentElement?.closest(".ui-icon")) {
    return;
  }

  tokenPattern.lastIndex = 0;
  if (!tokenPattern.test(textNode.nodeValue)) return;
  tokenPattern.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let cursor = 0;

  textNode.nodeValue.replace(tokenPattern, (token, offset) => {
    if (offset > cursor) {
      fragment.append(textNode.nodeValue.slice(cursor, offset));
    }

    const icon = document.createElement("span");
    icon.className = "ui-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = iconMarkup(ICONS[token]);
    fragment.append(icon);
    cursor = offset + token.length;
    return token;
  });

  if (cursor < textNode.nodeValue.length) {
    fragment.append(textNode.nodeValue.slice(cursor));
  }

  textNode.replaceWith(fragment);
}

function replaceIcons(root = document.body) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let textNode;

  while ((textNode = walker.nextNode())) {
    textNodes.push(textNode);
  }

  textNodes.forEach(replaceTextNode);
}

export function IconLayer() {
  useEffect(() => {
    replaceIcons();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) replaceIcons(node);
          if (node.nodeType === Node.TEXT_NODE) replaceTextNode(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}