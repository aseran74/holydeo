import React from 'react';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Review {
    id: string;
    user_name: string;
    user_avatar_url?: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewsListProps {
    reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
            />
        ))}
    </div>
);

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">Todavía no hay reseñas para esta propiedad. ¡Sé el primero!</p>;
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={review.user_avatar_url || `https://ui-avatars.com/api/?name=${review.user_name}&background=random`}
                        alt={review.user_name}
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{review.user_name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                                </p>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {review.comment}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList; 