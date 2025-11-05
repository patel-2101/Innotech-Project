'use client'

interface DashboardHeaderProps {
  title: string
  subtitle: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
