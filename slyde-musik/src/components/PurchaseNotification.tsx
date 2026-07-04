import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const plans = ['Artista', 'Artist Plus', 'Carreira profissional'];
const countries = [
  'Moçambique', 'Angola', 'Cabo Verde', 'São Tomé e Príncipe', 
  'Guiné-Bissau', 'África do Sul', 'Nigéria', 'Quênia', 
  'Gana', 'Tanzânia', 'Senegal', 'Costa do Marfim',
  'Zâmbia', 'Zimbábue', 'Botswana', 'Namíbia'
];

export function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({
    plan: '',
    country: '',
    timeAgo: 0
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const showNotification = () => {
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const randomTime = Math.floor(Math.random() * 59) + 1;

      setNotificationData({
        plan: randomPlan,
        country: randomCountry,
        timeAgo: randomTime
      });
      
      setIsVisible(true);

      // Hide after 5 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay before first notification
    const initialTimeout = setTimeout(() => {
      showNotification();
      
      // Then show periodically every 20-40 seconds
      intervalId = setInterval(() => {
        showNotification();
      }, Math.floor(Math.random() * 20000) + 20000);

    }, 3000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-50 bg-[#1e2329] border border-white/5 rounded-xl p-4 shadow-2xl max-w-sm flex items-start gap-4"
        >
          <div className="text-2xl mt-0.5">✨</div>
          <div className="flex-1 pr-4">
            <p className="text-sm text-gray-300 leading-snug">
              <span className="font-bold text-white">Plano {notificationData.plan}</span> acabou de ser comprado por um usuário em <span className="font-bold text-white">{notificationData.country}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1.5">
              Há {notificationData.timeAgo} {notificationData.timeAgo === 1 ? 'minuto' : 'minutos'}
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-white transition-colors absolute top-4 right-4"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
