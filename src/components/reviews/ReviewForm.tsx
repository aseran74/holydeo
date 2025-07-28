import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Star } from 'lucide-react';

interface ReviewFormProps {
    propertyId: string;
    onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ propertyId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Por favor, selecciona una puntuación.");
            return;
        }
        if (!userName.trim()) {
            setError("Por favor, introduce tu nombre.");
            return;
        }
        
        setIsSubmitting(true);
        setError('');

        // Aquí iría la lógica para obtener el usuario autenticado.
        // Por simplicidad, usaremos un nombre de usuario introducido manualmente.
        const { data: { user } } = await supabase.auth.getUser();

        const { error: insertError } = await supabase.from('reviews').insert({
            property_id: propertyId,
            rating: rating,
            comment: comment,
            user_id: user?.id,
            user_name: user?.user_metadata?.full_name || userName,
            user_avatar_url: user?.user_metadata?.avatar_url
        });

        if (insertError) {
            console.error("Error al guardar la reseña:", insertError);
            setError("Hubo un error al guardar tu reseña. Por favor, inténtalo de nuevo.");
        } else {
            setRating(0);
            setComment('');
            setUserName('');
            onReviewAdded(); // Llama a la función para refrescar la lista de reseñas
        }

        setIsSubmitting(false);
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Deja tu reseña</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tu nombre</label>
                    <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="Ej: Juan Pérez"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Puntuación</label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`cursor-pointer w-8 h-8 transition-colors ${
                                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
                                }`}
                                fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comentario (opcional)</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                        placeholder="Comparte tu experiencia..."
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm; 