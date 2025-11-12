'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Star, TrendingUp, DollarSign, Users } from 'lucide-react'

export default function VSLPage() {
  const [showContent, setShowContent] = useState(false)

  // Timer para mostrar contenido después de 9min50s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 590000) // 9min50s = 590,000ms

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Headline Principal - MAIS AGRESSIVA E MENOR */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
            <span className="text-emerald-600">¡EL MÉTODO SECRETO</span><br />
            QUE ESTÁ HACIENDO RICOS<br />
            <span className="text-green-700">A MILES DE LATINOS!</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 font-medium">
            Si estás <span className="text-red-600 font-bold">CANSADO</span> de trabajar para otros...<br />
            Si quieres <span className="text-emerald-600 font-bold">LIBERTAD FINANCIERA</span> de verdad...<br />
            <span className="text-green-700 font-bold">Este video cambiará tu vida para SIEMPRE.</span>
          </p>
        </div>

        {/* Video VSL - NOVO LINK PANDAVIDEO */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-6 bg-gradient-to-br from-emerald-100 to-green-100">
            <iframe
              src="https://player-vz-26ec749f-e49.tv.pandavideo.com.br/embed/?v=13ddded4-6e5c-4c2b-9e8d-7bdf9ba8d855"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="text-center">
            <p className="text-base text-gray-600 mb-4">
              ⚠️ <strong>ATENCIÓN:</strong> Este video contiene información CONFIDENCIAL
            </p>
            <p className="text-sm text-gray-500">
              🔒 Mira hasta el final para acceder al método completo
            </p>
          </div>
        </div>

        {/* Contenido que aparece después de 9min50s */}
        {showContent && (
          <div className="space-y-8 animate-fade-in">
            {/* Botón de Acción Principal */}
            <div className="text-center">
              <a 
                href="https://pay.hotmart.com/T102646971U?checkoutMode=10"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                🚀 ¡QUIERO ACCESO INMEDIATO AL MÉTODO!
              </a>
              <p className="text-sm text-gray-500 mt-4">
                ✅ Acceso instantáneo • ✅ Garantía de 30 días • ✅ Soporte 24/7
              </p>
            </div>

            {/* Beneficios - FONTES REDUZIDAS */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                🎯 Lo que vas a conseguir con el <span className="text-emerald-600">Método Renda Automática</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
                    title: "Genera $3,500-$8,000 USD mensuales",
                    description: "Sistema probado que funciona 24/7, incluso mientras duermes"
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                    title: "Resultados desde el primer mes",
                    description: "No esperes años, empieza a ver dinero en las próximas semanas"
                  },
                  {
                    icon: <Users className="w-8 h-8 text-emerald-600" />,
                    title: "Comunidad exclusiva de éxito",
                    description: "Únete a más de 5,000 latinos que ya están ganando"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
                    title: "Método paso a paso",
                    description: "Todo explicado de forma simple, sin tecnicismos complicados"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      {benefit.icon}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bullets de Transformación - FONTES REDUZIDAS */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                🔥 <span className="text-emerald-600">IMAGÍNATE</span> tu vida en 90 días...
              </h3>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  "✅ Despertarte SIN alarma, porque ya no dependes de un jefe",
                  "✅ Revisar tu cuenta bancaria y ver $5,000 USD que llegaron mientras dormías",
                  "✅ Decirle a tu familia: 'Nos vamos de vacaciones, yo pago todo'",
                  "✅ Trabajar desde cualquier lugar del mundo con solo tu laptop",
                  "✅ Tener la tranquilidad de NUNCA más preocuparte por el dinero",
                  "✅ Ser el ejemplo de éxito que tus hijos van a admirar",
                  "✅ Ayudar a tu familia y ser el héroe que siempre quisiste ser"
                ].map((bullet, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                    <div className="text-xl font-bold text-emerald-600">{bullet.split(' ')[0]}</div>
                    <p className="text-base text-gray-800 font-medium">{bullet.substring(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prova Social - FONTES REDUZIDAS */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">
                🏆 Resultados REALES de personas como TÚ
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "María González",
                    country: "México",
                    result: "$4,847 USD en 45 días",
                    quote: "No podía creer que fuera tan simple. Ahora mi familia vive mejor."
                  },
                  {
                    name: "Carlos Rodríguez",
                    country: "Colombia",
                    result: "$6,923 USD primer mes",
                    quote: "Dejé mi trabajo de oficina. Ahora soy mi propio jefe."
                  },
                  {
                    name: "Ana Martínez",
                    country: "Argentina",
                    result: "$7,156 USD mensuales",
                    quote: "Mis hijos ya no me ven estresada por dinero. Gracias infinitas."
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-base mb-4 italic">"{testimonial.quote}"</p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="font-bold text-lg text-emerald-200">{testimonial.result}</p>
                      <p className="text-sm opacity-90">{testimonial.name} - {testimonial.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final - PREÇO ALTERADO */}
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-4">🎯 ACCESO COMPLETO HOY</h3>
                <div className="text-5xl font-black mb-2">
                  <span className="line-through text-red-300 text-2xl">$97</span> $9
                </div>
                <p className="text-lg mb-6">Precio especial por tiempo limitado</p>
                
                <a 
                  href="https://pay.hotmart.com/T102646971U?checkoutMode=10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black text-xl font-bold py-6 px-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce"
                >
                  💳 ¡COMPRAR AHORA - ACCESO INMEDIATO!
                </a>
                
                <div className="mt-6 space-y-2 text-sm opacity-90">
                  <p>✅ Garantía incondicional de 30 días</p>
                  <p>✅ Soporte premium incluido</p>
                  <p>✅ Actualizaciones gratuitas de por vida</p>
                  <p>✅ Acceso a la comunidad VIP</p>
                </div>
              </div>

              <p className="text-gray-600 text-base">
                🔒 <strong>Compra 100% segura</strong> • Procesado por Stripe • SSL Certificado
              </p>
            </div>
          </div>
        )}

        {/* Mensaje mientras espera - FONTES REDUZIDAS */}
        {!showContent && (
          <div className="text-center bg-emerald-50 p-8 rounded-3xl">
            <div className="animate-pulse">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">
                🎬 Mira el video completo para desbloquear el acceso
              </h3>
              <p className="text-base text-gray-600">
                La información más valiosa aparecerá al final del video...
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
