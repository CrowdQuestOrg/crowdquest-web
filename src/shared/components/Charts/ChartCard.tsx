import { Card } from '../Common/Card';
import { Spinner } from '../Common/Spinner';

interface ChartCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartCard = ({
  title,
  description,
  children,
  loading,
  className = '',
  actions,
}: ChartCardProps) => {
  return (
    <Card className={`${className}`}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <Spinner size="lg" />
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};