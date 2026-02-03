import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoTitle: string;
}

export default function VideoModal({ isOpen, onClose, videoTitle }: VideoModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 lg:p-8">
            {/* Backdrop with high blur */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[95vw] lg:max-w-6xl aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 animate-scale-in">
                {/* Custom Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex justify-between items-start opacity-0 hover:opacity-100 transition-opacity duration-500 z-20">
                    <div className="space-y-1">
                        <span className="text-[#EAB308] text-[10px] font-black uppercase tracking-[0.3em]">Now Streaming</span>
                        <h3 className="text-white font-bold text-xl sm:text-2xl truncate pr-12 drop-shadow-lg">
                            {videoTitle}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="group p-3 bg-white/10 hover:bg-[#EAB308] rounded-full transition-all duration-300 backdrop-blur-md"
                    >
                        <X className="w-6 h-6 text-white group-hover:text-black group-hover:rotate-90 transition-all duration-500" />
                    </button>
                </div>

                {/* Video Player Container */}
                <div className="w-full h-full flex items-center justify-center bg-black group/player">
                    <video
                        autoPlay
                        controls
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80"
                    >
                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Quality Badges - Visible on hover */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 glass rounded-full opacity-0 translate-y-[-10px] group-hover/player:opacity-100 group-hover/player:translate-y-0 transition-all duration-500 z-10">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">4K UHD</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/20"></div>
                        <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">Dolby Vision</span>
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -inset-20 bg-[#EAB308]/5 blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
            </div>
        </div>,
        document.body
    );
}
