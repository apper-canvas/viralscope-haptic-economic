import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import ApperIcon from './ApperIcon'

const MainFeature = ({ onDataUpdate }) => {
  const [globalStats, setGlobalStats] = useState({
    totalCases: 0,
    totalDeaths: 0,
    totalRecovered: 0,
    activeCases: 0
  })
  
  const [countryData, setCountryData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('global')
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('30')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const refreshInterval = useRef(null)
  const dropdownRef = useRef(null)

  // Mock data for demonstration
  const mockGlobalData = {
    totalCases: 704234915,
    totalDeaths: 7010681,
    totalRecovered: 675825234,
    activeCases: 21399000
  }

  const mockCountries = [
    { code: 'US', name: 'United States', cases: 103436829, deaths: 1127152, recovered: 101000000, population: 331900000 },
    { code: 'IN', name: 'India', cases: 44690738, deaths: 530779, recovered: 44153796, population: 1380000000 },
    { code: 'FR', name: 'France', cases: 38997490, deaths: 174627, recovered: 38500000, population: 67390000 },
    { code: 'DE', name: 'Germany', cases: 38437756, deaths: 174979, recovered: 38000000, population: 83240000 },
    { code: 'BR', name: 'Brazil', cases: 37519960, deaths: 689016, recovered: 36500000, population: 215300000 },
    { code: 'JP', name: 'Japan', cases: 33803572, deaths: 74694, recovered: 33500000, population: 125800000 },
    { code: 'KR', name: 'South Korea', cases: 31441184, deaths: 34141, recovered: 31200000, population: 51780000 },
    { code: 'IT', name: 'Italy', cases: 25603510, deaths: 190357, recovered: 25200000, population: 59550000 }
  ]

  // Generate mock time series data
  const generateTimeSeriesData = (country = 'global', days = 30) => {
    const data = []
    const baseDate = new Date()
    const baseCases = country === 'global' ? 1000000 : 50000
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() - i)
      
      const randomVariation = (Math.random() - 0.5) * 0.1
      const trend = Math.sin((days - i) / 10) * 0.05
      const cases = Math.max(0, Math.floor(baseCases * (1 + trend + randomVariation)))
      
      data.push({
        date: date.toISOString().split('T')[0],
        cases,
        deaths: Math.floor(cases * 0.02),
        recovered: Math.floor(cases * 0.95)
      })
    }
    
    return data
  }

  const fetchData = async (showToast = true) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setGlobalStats(mockGlobalData)
      setCountryData(mockCountries)
      
      if (showToast) {
        toast.success('Data updated successfully!')
      }
      
      if (onDataUpdate) {
        onDataUpdate(new Date())
      }
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(false)
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchData(false)
      }, 300000) // 5 minutes
    } else if (refreshInterval.current) {
      clearInterval(refreshInterval.current)
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current)
      }
    }
  }, [autoRefresh])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCountryData = selectedCountry === 'global' 
    ? globalStats 
    : countryData.find(country => country.code === selectedCountry)

  const filteredCountries = countryData.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const timeSeriesData = generateTimeSeriesData(selectedCountry, parseInt(timeRange))

  const chartOptions = {
    chart: {
      id: 'covid-chart',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: {
      mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    },
    colors: ['#3b82f6', '#ef4444', '#10b981'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 3
    },
xaxis: {
      categories: timeSeriesData.map(item => item.date),
      labels: {
        style: {
          fontSize: '12px'
        },
        formatter: function(value) {
          const date = new Date(value)
          const days = parseInt(timeRange)
          
          if (days >= 90) {
            // For large ranges, show abbreviated month/day
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          } else if (days >= 30) {
            // For medium ranges, show month/day
            return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
          } else {
            // For short ranges, show month/day
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        },
        rotate: timeRange >= 90 ? -45 : 0,
        maxHeight: 100
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
          if (value >= 1000) return (value / 1000).toFixed(1) + 'K'
          return value.toString()
        },
        style: {
          fontSize: '12px'
        }
      }
    },
tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: function(value) {
          try {
            const dataIndex = value - 1
            const dateString = timeSeriesData[dataIndex]?.date
            
            if (!dateString) {
              return 'Invalid Date'
            }
            
            const date = new Date(dateString)
            if (isNaN(date.getTime())) {
              return 'Invalid Date'
            }
            
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          } catch (error) {
            return 'Invalid Date'
          }
        }
      },
      y: {
        formatter: (value) => {
          try {
            return value && typeof value === 'number' ? value.toLocaleString() : '0'
          } catch (error) {
            return '0'
          }
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  }

  const chartSeries = [
    {
      name: 'Cases',
      data: timeSeriesData.map(item => item.cases)
    },
    {
      name: 'Deaths',
      data: timeSeriesData.map(item => item.deaths)
    },
    {
      name: 'Recovered',
      data: timeSeriesData.map(item => item.recovered)
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Controls Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Country Selection */}
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Select Region
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="input-field flex items-center justify-between cursor-pointer hover:border-primary focus:border-primary"
              >
                <span className="flex items-center gap-2">
                  <ApperIcon name="Globe" className="w-4 h-4 text-surface-500" />
                  {selectedCountry === 'global' 
                    ? 'Global Overview' 
                    : countryData.find(c => c.code === selectedCountry)?.name || 'Select Country'
                  }
                </span>
                <ApperIcon 
                  name="ChevronDown" 
                  className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl shadow-card z-50 max-h-60 overflow-hidden"
                  >
                    <div className="p-3 border-b border-surface-200 dark:border-surface-700">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCountry('global')
                          setIsDropdownOpen(false)
                          setSearchTerm('')
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center gap-2 text-sm"
                      >
                        <ApperIcon name="Globe" className="w-4 h-4 text-primary" />
                        Global Overview
                      </button>
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country.code)
                            setIsDropdownOpen(false)
                            setSearchTerm('')
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700 flex items-center gap-2 text-sm"
                        >
                          <ApperIcon name="MapPin" className="w-4 h-4 text-surface-500" />
                          {country.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-field py-2 pr-8"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="input-field py-2 pr-8"
              >
                <option value="line">Line Chart</option>
                <option value="area">Area Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3">
            <motion.button
              onClick={() => fetchData(true)}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              <ApperIcon 
                name="RefreshCw" 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              />
              {isLoading ? 'Updating...' : 'Refresh'}
            </motion.button>

            <motion.button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`btn-secondary flex items-center gap-2 ${
                autoRefresh ? 'bg-primary text-white' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name={autoRefresh ? "Pause" : "Play"} className="w-4 h-4" />
              Auto-refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          { 
            key: 'totalCases', 
            label: 'Total Cases', 
            icon: 'TrendingUp', 
            color: 'text-primary',
            bgColor: 'bg-primary/10'
          },
          { 
            key: 'totalDeaths', 
            label: 'Deaths', 
            icon: 'AlertCircle', 
            color: 'text-secondary',
            bgColor: 'bg-secondary/10'
          },
          { 
            key: 'totalRecovered', 
            label: 'Recovered', 
            icon: 'Heart', 
            color: 'text-success',
            bgColor: 'bg-success/10'
          },
          { 
            key: 'activeCases', 
            label: 'Active', 
            icon: 'Activity', 
            color: 'text-warning',
            bgColor: 'bg-warning/10'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="stat-card group hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <ApperIcon name={stat.icon} className={`w-5 h-5 ${stat.color}`} />
              </div>
              {isLoading && (
                <div className="w-4 h-4 border-2 border-surface-300 border-t-primary rounded-full animate-spin" />
              )}
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100 mb-1">
                {selectedCountryData && typeof selectedCountryData[stat.key] === 'number'
                  ? selectedCountryData[stat.key].toLocaleString()
                  : '0'
                }
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="chart-container"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-surface-800 dark:text-surface-100">
              Trend Analysis
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {selectedCountry === 'global' 
                ? 'Global COVID-19 statistics over time'
                : `COVID-19 statistics for ${countryData.find(c => c.code === selectedCountry)?.name || 'Selected Country'}`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            Last {timeRange} days
          </div>
        </div>

        <div className="h-64 sm:h-80 lg:h-96">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type={chartType}
            height="100%"
          />
        </div>
      </motion.div>

      {/* Additional Info */}
      {selectedCountry !== 'global' && selectedCountryData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-4 sm:p-6"
        >
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-4">
            Country Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Population</p>
              <p className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                {selectedCountryData.population?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Cases per 100K</p>
              <p className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                {selectedCountryData.population 
                  ? Math.round((selectedCountryData.cases / selectedCountryData.population) * 100000).toLocaleString()
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Mortality Rate</p>
              <p className="text-lg font-semibold text-secondary">
                {selectedCountryData.cases > 0
                  ? ((selectedCountryData.deaths / selectedCountryData.cases) * 100).toFixed(2) + '%'
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Recovery Rate</p>
              <p className="text-lg font-semibold text-success">
                {selectedCountryData.cases > 0
                  ? ((selectedCountryData.recovered / selectedCountryData.cases) * 100).toFixed(2) + '%'
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MainFeature