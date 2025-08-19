// components/DashboardCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function DashboardCarousel({
  widgets,
  settings,
  onWidgetClick,
  openSettings,
  slidesPerView = 1,
}) {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      pagination={{ clickable: true }}
      navigation
      spaceBetween={16}
      slidesPerView={slidesPerView}
      className="w-full"
    >
      {widgets.map((widget) => {
        const style = settings.widgetStyles?.[widget.id] || {};
        const savedTitle = settings.widgetTitles?.[widget.id] || widget.title;
        const bg = style.backgroundColor || "#ffffffff";

        return (
          <SwiperSlide key={widget.id}>
            <div
              onClick={() => onWidgetClick(widget.id)}
              className="relative p-6 rounded-2xl shadow-md transition-all duration-300
                         hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: bg }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onWidgetClick(widget.id)}
            >
              {/* Settings (doesn't navigate) */}
              <button
                type="button"
                aria-label="Widget settings"
                className="absolute top-3 right-3 rounded-xl p-2 bg-white/70 hover:bg-white shadow transition"
                onClick={(e) => {
                  e.stopPropagation();
                  openSettings && openSettings(widget.id);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                        stroke="currentColor" strokeWidth="1.6" />
                  <path d="M19.4 13.5a7.8 7.8 0 0 0 .06-3l2-1.15-2-3.46-2.3.65a7.9 7.9 0 0 0-2.6-1.5L12 2 9.45 5.04a7.9 7.9 0 0 0-2.6 1.5l-2.3-.65-2 3.46 2 1.15a7.8 7.8 0 0 0 0 3l-2 1.15 2 3.46 2.3-.65c.8.63 1.67 1.15 2.6 1.5L12 22l2.55-3.04c.93-.35 1.8-.87 2.6-1.5l2.3.65 2-3.46-2.05-1.15Z"
                        stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>

              <h2 className="font-bold text-lg">{savedTitle}</h2>
              <p className="text-sm text-gray-700">
                This is your {savedTitle.toLowerCase()} widget.
              </p>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
