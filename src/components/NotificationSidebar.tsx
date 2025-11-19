import React from 'react';
import { X, AlertTriangle, MapPin, TrendingUp, Flame } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  location: string;
  section: string;
  insights: string[];
  icon: React.ReactNode;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

const NotificationSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  // Sample alert data based on the requirements
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'New vehicles detected',
      location: 'North African Military basecamp',
      section: 'Deep Insights',
      insights: ['30% increase in vehicles over 1 month'],
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      severity: 'medium',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'Smoke detected',
      location: 'Industrial Zone',
      section: 'Deep Insights',
      insights: ['Spike in CO2 detector logs'],
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      severity: 'high',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      title: 'Tents Detected',
      location: 'Eastern border',
      section: 'Deep Insights',
      insights: [
        '5 new vehicles crossing near border',
        '20 phone numbers active within 48 hours near border'
      ],
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      severity: 'high',
      timestamp: '30 minutes ago'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {alerts.length} Active
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${getSeverityColor(
                alert.severity
              )}`}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {alert.icon}
                  <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityBadgeColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{alert.location}</span>
              </div>

              {/* Section */}
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {alert.section}
                </span>
              </div>

              {/* Insights */}
              <div className="space-y-1">
                {alert.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>

              {/* Timestamp */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
