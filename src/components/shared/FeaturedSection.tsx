import React from 'react';
import SkeletonCard from './SkeletonCard';

interface FeaturedSectionProps<T> {
    title: string;
    description: string;
    items: T[];
    loading: boolean;
    renderItem: (item: T) => React.ReactNode;
    loadingSkeletons?: number;
}

const FeaturedSection = <T extends { id: string | number }>({
    title,
    description,
    items,
    loading,
    renderItem,
    loadingSkeletons = 3
}: FeaturedSectionProps<T>) => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading 
                        ? Array.from({ length: loadingSkeletons }).map((_, i) => <SkeletonCard key={i} />)
                        : items.map(renderItem)
                    }
                </div>
                {!loading && items.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No hay elementos disponibles en este momento.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection; 