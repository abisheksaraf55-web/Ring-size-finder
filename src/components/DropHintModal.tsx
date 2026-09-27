import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  X,
  Share2,
  Heart,
  Sparkles,
  HelpCircle,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { JewelryRing, MetalType } from '../types/ring';
import { METAL_CONFIG, getClosestSizeByDiameter, RING_SIZE_DATA } from '../data/ringSizes';

interface DropHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: string;
  activeRing?: JewelryRing;
  selectedMetal?: MetalType;
}

export const DropHintModal: React.FC<DropHintModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  activeRing,
  selectedMetal = 'yellow-gold'
}) => {
  const [recipientName, setRecipientName] = useState<string>('My Love');
  const [senderName, setSenderName] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>(
    'In case you were wondering about my ring size for our upcoming celebration...'
  );
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [tab, setTab] = useState<'card' | 'stealth-guide'>('card');

  if (!isOpen) return null;

  const currentSizeObj =
    RING_SIZE_DATA.find((r) => r.us === selectedSize) || RING_SIZE_DATA[8];
  const ringName = activeRing ? activeRing.name : 'Il Rettangolo Minimal Luxe Bar Ring';
  const metalName = METAL_CONFIG[selectedMetal]?.name || '18K Yellow Gold';

  const shareText = `✨ A subtle hint from ${senderName || 'someone who loves you'}:\n\n` +
    `Dear ${recipientName},\n` +
    `"${customMessage}"\n\n` +
    `💍 Dream Ring: ${ringName}\n` +
    `✨ Metal: ${metalName}\n` +
    `📏 Ring Size: US ${selectedSize} (UK ${currentSizeObj.uk} · EU ${currentSizeObj.eu} · ${currentSizeObj.diameterMm}mm)\n` +
    `Crafted in Vicenza, Italy at Aura Oro Atelier.`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCopyLink = () => {
    const url = window.location.href.split('?')[0] + `?size=${selectedSize}&ring=${activeRing?.id || 'minimal-luxe-bar'}&metal=${selectedMetal}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden my-8 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-800">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-slate-900">
                Drop a Hint & Stealth Gifting
              </h2>
              <p className="text-xs text-slate-500">
                Share your exact measured ring size effortlessly or find secret gifting tips.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mt-4 mb-5 border-b border-slate-200 pb-2">
          <button
            onClick={() => setTab('card')}
            className={`text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer ${
              tab === 'card'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Shareable Hint Card
          </button>
          <button
            onClick={() => setTab('stealth-guide')}
            className={`text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer ${
              tab === 'stealth-guide'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Stealth Gifting Guide (Buying in Secret?)
          </button>
        </div>

        {tab === 'card' ? (
          <div className="space-y-4">
            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">To (Partner / Friend):</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Matteo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">From (Your Name):</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Sofia"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            {/* Hint Note */}
            <div className="text-xs">
              <label className="text-slate-600 block mb-1">Personal Note:</label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* The Visual Luxury Hint Card */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative shadow-sm space-y-3">
              <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-mono text-slate-500">
                <span>Aura Oro Atelier · Gift Hint</span>
                <span>Vicenza, Italia</span>
              </div>

              <div className="font-semibold text-lg text-slate-900">
                {recipientName ? `For ${recipientName}` : 'For Someone Special'}
              </div>

              <p className="text-xs text-slate-600 italic font-light">
                "{customMessage}"
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Model</div>
                  <div className="text-slate-800 font-medium">{ringName}</div>
                  <div className="text-slate-500 text-[11px]">{metalName}</div>
                </div>

                <div className="text-right">
                  <div className="text-slate-400 text-[10px] uppercase">Exact Size</div>
                  <div className="text-lg font-bold text-slate-900">
                    US {selectedSize}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    UK {currentSizeObj.uk} · {currentSizeObj.diameterMm}mm
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCopyText}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Message!</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Text for WhatsApp / SMS</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Shareable URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Stealth Gifting Guide */
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <span>
                Want to surprise them without asking? Here are jeweler-tested stealth techniques to find their ring size secretly:
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2">
                <div className="font-semibold text-slate-900 text-sm">
                  1. The Screen Sizer Borrow (Most Accurate)
                </div>
                <p className="text-slate-600 mt-1">
                  When they take off a ring they wear on the same finger, borrow it for 60 seconds. Open the Screen Sizer on your phone and match the inner circle.
                </p>
              </div>

              <div className="pt-3">
                <div className="font-semibold text-slate-900 text-sm">
                  2. The Soap / Wax Impression
                </div>
                <p className="text-slate-600 mt-1">
                  Press their ring firmly into a soft bar of soap or candle wax until it leaves a clear imprint, then measure the diameter with our on-screen ruler.
                </p>
              </div>

              <div className="pt-3">
                <div className="font-semibold text-slate-900 text-sm">
                  3. The Slide-On-Your-Own-Finger Trick
                </div>
                <p className="text-slate-600 mt-1">
                  Slip their ring onto one of your own fingers. Draw a pen mark exactly where it stops on your finger, then measure that spot.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
