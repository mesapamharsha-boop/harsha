import { Request, Response } from 'express';
import { BookingModel, InquiryModel, PortfolioModel, ReelModel } from '../models/index';

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await BookingModel.find();
    const inquiries = await InquiryModel.find();
    const portfolio = await PortfolioModel.find();
    const reels = await ReelModel.find();

    const totalBookings = bookings.length;
    const totalInquiries = inquiries.length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
    const conversionRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

    // Service popularity count
    const serviceCounts: Record<string, number> = {};
    bookings.forEach(b => {
      const s = b.service || 'Other';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
    const mostRequestedService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Instagram Reels';

    // City popularity
    const cityCounts: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.city) {
        const c = b.city.trim();
        cityCounts[c] = (cityCounts[c] || 0) + 1;
      }
    });
    const mostPopularCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Vijayawada';

    // Upcoming events
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = bookings
      .filter(b => b.eventDate >= today && b.status !== 'CANCELLED')
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      .slice(0, 6);

    // Bookings by month (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyStats[key] = 0;
    }

    bookings.forEach(b => {
      if (b.createdAt) {
        const d = new Date(b.createdAt);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        if (monthlyStats[key] !== undefined) {
          monthlyStats[key]++;
        }
      }
    });

    const monthlyChartData = Object.entries(monthlyStats).map(([month, count]) => ({ month, count }));

    // Status distribution
    const statusCounts = {
      NEW: bookings.filter(b => b.status === 'NEW').length,
      CONTACTED: bookings.filter(b => b.status === 'CONTACTED').length,
      CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
      COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
      CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    };

    res.json({
      success: true,
      analytics: {
        totalBookings,
        totalInquiries,
        confirmedBookings,
        conversionRate,
        mostRequestedService,
        mostPopularCity,
        portfolioCount: portfolio.length,
        reelsCount: reels.length,
        statusCounts,
        monthlyChartData,
        upcomingEvents,
        serviceDistribution: Object.entries(serviceCounts).map(([name, value]) => ({ name, value })),
      },
    });
  } catch (error) {
    console.error('[Analytics] Error calculating analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate analytics.' });
  }
};
