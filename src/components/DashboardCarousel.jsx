// components/DashboardCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Widget from "./Widget";

export default function DashboardCarousel({ widgets, settings, renderWidgetContent, openSettings, slidesPerView = 1 }) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={slidesPerView}
      pagination={{ clickable: true }}
      navigation
      modules={[Pagination, Navigation]}
    >
      {widgets.map((widget) => {
        const style = settings.widgetStyles[widget.id] || {};
        const savedTitle = settings.widgetTitles?.[widget.id] || widget.title;

        return (
          <SwiperSlide key={widget.id}>
            <Widget
              id={widget.id}
              title={savedTitle}
              description={`This is your ${savedTitle.toLowerCase()} widget.`}
              style={{
                backgroundColor: style.backgroundColor || "#fef3c7",
              }}
              onSettingsClick={() => openSettings(widget.id)}
            >
              {renderWidgetContent(widget)}
            </Widget>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
