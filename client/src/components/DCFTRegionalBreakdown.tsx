import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RegionalData {
  region: string;
  gmi: number;
  cfi: number;
  hri: number;
  population: number;
  trend: number;
}

interface DCFTRegionalBreakdownProps {
  data: RegionalData[];
  title?: string;
}

const COLORS = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6'];

export function DCFTRegionalBreakdown({ 
  data, 
  title = 'Regional DCFT Analysis' 
}: DCFTRegionalBreakdownProps) {
  // Calculate global averages
  const globalAverages = {
    gmi: (data.reduce((sum, d) => sum + d.gmi, 0) / data.length).toFixed(1),
    cfi: (data.reduce((sum, d) => sum + d.cfi, 0) / data.length).toFixed(1),
    hri: (data.reduce((sum, d) => sum + d.hri, 0) / data.length).toFixed(1),
  };

  // Sort by GMI for better visualization
  const sortedData = [...data].sort((a, b) => b.gmi - a.gmi);

  // Prepare pie chart data
  const pieData = data.map(d => ({
    name: d.region,
    value: d.population,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Averages */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600">المتوسط العالمي - GMI</p>
            <p className="text-2xl font-bold text-blue-600">{globalAverages.gmi}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600">المتوسط العالمي - CFI</p>
            <p className="text-2xl font-bold text-purple-600">{globalAverages.cfi}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600">المتوسط العالمي - HRI</p>
            <p className="text-2xl font-bold text-green-600">{globalAverages.hri}</p>
          </div>
        </div>

        {/* Regional Comparison Bar Chart */}
        <div>
          <h4 className="font-semibold mb-3">مقارنة المناطق - مؤشر المزاج العام (GMI)</h4>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : String(value)} />
                <Bar dataKey="gmi" fill="#3B82F6" name="GMI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Population Distribution Pie Chart */}
        <div>
          <h4 className="font-semibold mb-3">توزيع السكان حسب المنطقة</h4>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Regional Table */}
        <div>
          <h4 className="font-semibold mb-3">تفاصيل المناطق</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-right py-2 px-3">المنطقة</th>
                  <th className="text-center py-2 px-3">GMI</th>
                  <th className="text-center py-2 px-3">CFI</th>
                  <th className="text-center py-2 px-3">HRI</th>
                  <th className="text-center py-2 px-3">السكان</th>
                  <th className="text-center py-2 px-3">الاتجاه</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((region, index) => (
                  <tr key={region.region} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-3 font-semibold">{region.region}</td>
                    <td className="text-center py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        region.gmi > 70 ? 'bg-green-100 text-green-800' :
                        region.gmi > 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {region.gmi.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center py-2 px-3">
                      <span className="text-purple-600 font-semibold">{region.cfi.toFixed(1)}</span>
                    </td>
                    <td className="text-center py-2 px-3">
                      <span className="text-green-600 font-semibold">{region.hri.toFixed(1)}</span>
                    </td>
                    <td className="text-center py-2 px-3 text-gray-600">
                      {(region.population / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-center py-2 px-3">
                      <span className={region.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                        {region.trend > 0 ? '📈' : '📉'} {Math.abs(region.trend).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 الرؤى الرئيسية</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• أعلى مؤشر مزاج: <strong>{sortedData[0]?.region}</strong> ({sortedData[0]?.gmi.toFixed(1)})</li>
            <li>• أقل مؤشر مزاج: <strong>{sortedData[sortedData.length - 1]?.region}</strong> ({sortedData[sortedData.length - 1]?.gmi.toFixed(1)})</li>
            <li>• أكبر منطقة سكانية: <strong>{data.sort((a, b) => b.population - a.population)[0]?.region}</strong></li>
            <li>• أسرع نمو عاطفي: <strong>{data.sort((a, b) => b.trend - a.trend)[0]?.region}</strong> (+{data.sort((a, b) => b.trend - a.trend)[0]?.trend.toFixed(1)}%)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
