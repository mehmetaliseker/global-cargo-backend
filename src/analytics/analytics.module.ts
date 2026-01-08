import { Module } from '@nestjs/common';
import { DashboardMetricModule } from './dashboard-metric/dashboard-metric.module';
import { TimeSeriesDataModule } from './time-series-data/time-series-data.module';
import { DashboardConfigModule } from './dashboard-config/dashboard-config.module';
import { DashboardWidgetModule } from './dashboard-widget/dashboard-widget.module';
import { GeoCoordinateModule } from './geo-coordinate/geo-coordinate.module';
import { RouteVisualizationModule } from './route-visualization/route-visualization.module';

@Module({
    imports: [
        DashboardMetricModule,
        TimeSeriesDataModule,
        DashboardConfigModule,
        DashboardWidgetModule,
        GeoCoordinateModule,
        RouteVisualizationModule,
    ],
    exports: [
        DashboardMetricModule,
        TimeSeriesDataModule,
        DashboardConfigModule,
        DashboardWidgetModule,
        GeoCoordinateModule,
        RouteVisualizationModule,
    ],
})
export class AnalyticsModule { }
