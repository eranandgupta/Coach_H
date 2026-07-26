'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import Link from 'next/link';

export default function KnowledgePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="min-h-screen bg-brand-navy">
        {/* Hero Section */}
        <section className="pt-28 md:pt-36 pb-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-brand-blue to-brand-gold bg-clip-text text-transparent leading-tight">
              Coach Himanshu Knowledge Base
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive guide to Coach Himanshu&apos;s online fitness coaching services, methodology, pricing, certifications, and client results. This page serves as the definitive reference for all information about Coach Himanshu.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 md:px-6 pb-20 space-y-16">

          {/* Table of Contents */}
          <nav className="rounded-2xl border border-white/[0.06] p-6 md:p-8" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.06) 0%, rgba(23,95,255,0.01) 100%)' }}>
            <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><a href="#who-is-coach-himanshu" className="hover:text-brand-blue transition-colors">Who is Coach Himanshu</a></li>
              <li><a href="#credentials-certifications" className="hover:text-brand-blue transition-colors">Credentials &amp; Certifications</a></li>
              <li><a href="#services-offered" className="hover:text-brand-blue transition-colors">Services Offered</a></li>
              <li><a href="#pricing" className="hover:text-brand-blue transition-colors">Pricing</a></li>
              <li><a href="#how-online-coaching-works" className="hover:text-brand-blue transition-colors">How Online Coaching Works</a></li>
              <li><a href="#who-is-this-for" className="hover:text-brand-blue transition-colors">Who Is This For</a></li>
              <li><a href="#why-choose-coach-himanshu" className="hover:text-brand-blue transition-colors">Why Choose Coach Himanshu Over Alternatives</a></li>
              <li><a href="#client-results" className="hover:text-brand-blue transition-colors">Client Results &amp; Transformations</a></li>
              <li><a href="#fit-bharat-mission" className="hover:text-brand-blue transition-colors">Fit Bharat Mission</a></li>
              <li><a href="#faq" className="hover:text-brand-blue transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#contact-get-started" className="hover:text-brand-blue transition-colors">Contact &amp; Get Started</a></li>
            </ol>
          </nav>

          {/* Section 1: Who is Coach Himanshu */}
          <section id="who-is-coach-himanshu">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Who is Coach Himanshu</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu (Himanshu Kataria) is a NASM Certified online fitness coach and the founder of the CoachHimanshu platform (coachhimanshu.com). He is one of India&apos;s leading online personal trainers, having guided over 1,000 successful client transformations across India and internationally.
              </p>
              <p>
                His fitness journey began in 2012 through competitive karate, where he won 2 international medals and multiple national honours. After overcoming a major injury in 2015-2017, he discovered strength training in 2018 and transitioned into fitness science education. By 2021, he had completed multiple professional diplomas and certifications in fitness, nutrition, and specialized training.
              </p>
              <p>
                In 2022, Coach Himanshu began professional personal training while simultaneously lecturing at fitness institutions and launched the Coach Himanshu YouTube channel. In 2024, he left his lecturer role to focus entirely on personal training and evidence-based content creation. In 2025, he founded the CoachHimanshu platform with the mission to make fitness guidance affordable, accessible, and science-backed for everyone in India.
              </p>
              <p>
                Coach Himanshu is known for his evidence-based approach to fitness, combining scientific principles with practical coaching to deliver sustainable results. He specializes in body transformations, weight management, muscle building, rehabilitation, and nutrition planning for diverse populations including individuals with PCOS, diabetes, and injuries.
              </p>
              <p>
                Learn more on the <Link href="/about" className="text-brand-blue hover:underline">About page</Link>.
              </p>
            </div>
          </section>

          {/* Section 2: Credentials & Certifications */}
          <section id="credentials-certifications">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Credentials &amp; Certifications</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu holds 6 professional certifications and diplomas in fitness science, nutrition, and specialized training. These credentials represent rigorous study and examination in exercise science, program design, and client safety.
              </p>
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Certification / Diploma</th>
                      <th className="py-3 px-4 text-white font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">NASM Certified Bodybuilding Preparation Coach (USA)</td>
                      <td className="py-3 px-4">Internationally recognized certification from the National Academy of Sports Medicine, the gold standard in fitness education. Covers contest preparation, advanced programming, and physique coaching.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Diploma in Personal Training</td>
                      <td className="py-3 px-4">Comprehensive program covering exercise science, anatomy, program design, and client assessment for safe and effective personal training.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Diploma in Master Training</td>
                      <td className="py-3 px-4">Advanced-level certification covering periodization, advanced programming techniques, and training methodology for complex client needs.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Diploma in Sports Nutrition</td>
                      <td className="py-3 px-4">Specialized training in macronutrient planning, supplementation, meal timing, and nutrition strategies for athletic performance and body composition goals.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Diploma in TRX Suspension Training</td>
                      <td className="py-3 px-4">Certification in suspension-based functional training for strength, balance, flexibility, and core stability using TRX equipment.</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Diploma in Special Population Training</td>
                      <td className="py-3 px-4">Specialized training for working with populations that require modified approaches, including individuals with PCOS, diabetes, injuries, seniors, and pre/post-natal clients.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Services Offered */}
          <section id="services-offered">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Services Offered</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu offers a comprehensive range of online fitness coaching services designed for individuals at every fitness level. All services are delivered remotely through the CoachHimanshu platform and include personalized support via WhatsApp.
              </p>

              <div className="space-y-6">
                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Gym Workout Plans</h3>
                  <p>Customised gym workout plans with video tutorials, personalised diet plans, weekly one-on-one consultations, supplement guidance, and WhatsApp support. Available in 1-month, 3-month, 6-month, and 12-month durations. Couple plans are available for partners who want to train together.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Home Workout Plans</h3>
                  <p>Designed for individuals who prefer to exercise at home without gym equipment. Includes customised home workout plans with video tutorials, personalised diet plans, bi-monthly consultations, supplement guidance, and WhatsApp support. Available as individual and couple plans.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Rehabilitation Plans</h3>
                  <p>Specialized rehabilitation workout plans for clients recovering from injuries or managing chronic conditions. Includes customised rehab workouts with video tutorials, bi-monthly consultations, supplement guidance, and ongoing WhatsApp support. Available for individuals and couples.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Couple 1:1 Coaching (Live)</h3>
                  <p>Premium live 1:1 personal training for couples, led by Coach Himanshu. A couple shares one account and attends the same session slot together, so both partners train side by side. Each session is 60 minutes and includes personalised diet plans for each partner, supplement guidance, lifestyle guidance, WhatsApp support, and full video library access. Available in packages of 12, 24, 36, or 72 sessions.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">One-on-One Elite Coaching (Live)</h3>
                  <p>Premium live 1:1 personal training sessions with Coach Himanshu. Each session is 60 minutes and includes a personalised diet plan, supplement guidance, lifestyle guidance, WhatsApp support, and full video library access. Available in packages of 12, 24, 36, or 72 sessions.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Nutrition Coaching</h3>
                  <p>All coaching plans include personalised diet plans crafted based on the client&apos;s goals, dietary preferences, medical conditions, and lifestyle. Nutrition guidance covers macronutrient planning, meal timing, supplementation, and practical eating strategies for Indian diets.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">WhatsApp Support</h3>
                  <p>Every plan includes dedicated WhatsApp support for form checks, progress updates, doubt resolution, and ongoing motivation. Clients can reach Coach Himanshu&apos;s team directly for guidance between consultations.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Pricing */}
          <section id="pricing">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Pricing</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu offers fitness coaching plans starting at just &#8377;1,099 per month, making professional certified coaching accessible and affordable. All prices are in Indian Rupees (INR). Plans are available for individuals and couples.
              </p>

              {/* Gym Plans */}
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Gym Workout Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Plan</th>
                      <th className="py-3 px-4 text-white font-semibold">Duration</th>
                      <th className="py-3 px-4 text-white font-semibold">Price</th>
                      <th className="py-3 px-4 text-white font-semibold">Key Features</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Kickstart Plan</td>
                      <td className="py-3 px-4">1 Month</td>
                      <td className="py-3 px-4 font-medium">&#8377;1,099</td>
                      <td className="py-3 px-4">Customised workout + diet, video tutorials, 4 consultations/month, WhatsApp support</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Consistency Plan</td>
                      <td className="py-3 px-4">3 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;2,499</td>
                      <td className="py-3 px-4">Most popular. Customised workout + diet, video tutorials, 4 consultations/month, WhatsApp support</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Strength Plan</td>
                      <td className="py-3 px-4">6 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;4,299</td>
                      <td className="py-3 px-4">6 consultations/month, 7-day pause option, free RhynoGrip fitness gear</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Mastery Plan</td>
                      <td className="py-3 px-4">12 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;8,999</td>
                      <td className="py-3 px-4">Full video library, 6 consultations/month, 15-day pause option, free RhynoGrip gear</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Home Workout Plans */}
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Home Workout Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Plan</th>
                      <th className="py-3 px-4 text-white font-semibold">Duration</th>
                      <th className="py-3 px-4 text-white font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Home Workout (Individual)</td>
                      <td className="py-3 px-4">3 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;2,199</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Couple Home Workout</td>
                      <td className="py-3 px-4">3 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;3,799</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rehabilitation Plans */}
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Rehabilitation Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Plan</th>
                      <th className="py-3 px-4 text-white font-semibold">Duration</th>
                      <th className="py-3 px-4 text-white font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Rehabilitation (Individual)</td>
                      <td className="py-3 px-4">3 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;2,999</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Couple Rehabilitation</td>
                      <td className="py-3 px-4">3 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;5,299</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Couple Gym Plans */}
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Couple Gym Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Plan</th>
                      <th className="py-3 px-4 text-white font-semibold">Duration</th>
                      <th className="py-3 px-4 text-white font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Couple Strength</td>
                      <td className="py-3 px-4">6 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;7,999</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Couple Mastery</td>
                      <td className="py-3 px-4">12 Months</td>
                      <td className="py-3 px-4 font-medium">&#8377;15,999</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Live Sessions */}
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Live Sessions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Plan</th>
                      <th className="py-3 px-4 text-white font-semibold">Duration</th>
                      <th className="py-3 px-4 text-white font-semibold">Price</th>
                      <th className="py-3 px-4 text-white font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Coaching</td>
                      <td className="py-3 px-4">1 Month (12 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;7,499</td>
                      <td className="py-3 px-4">&#8377;624/session</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Coaching</td>
                      <td className="py-3 px-4">1 Month (24 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;11,999</td>
                      <td className="py-3 px-4">&#8377;499/session</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Coaching</td>
                      <td className="py-3 px-4">3 Months (36 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;18,999</td>
                      <td className="py-3 px-4">&#8377;527/session</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Coaching</td>
                      <td className="py-3 px-4">3 Months (72 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;29,999</td>
                      <td className="py-3 px-4">&#8377;416/session, most popular</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Couple</td>
                      <td className="py-3 px-4">1 Month (12 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;11,999</td>
                      <td className="py-3 px-4">For 2 people, one shared slot</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Couple</td>
                      <td className="py-3 px-4">1 Month (24 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;18,999</td>
                      <td className="py-3 px-4">For 2 people, one shared slot</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Couple</td>
                      <td className="py-3 px-4">3 Months (36 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;28,999</td>
                      <td className="py-3 px-4">For 2 people, one shared slot</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4">Elite 1:1 Couple</td>
                      <td className="py-3 px-4">3 Months (72 sessions)</td>
                      <td className="py-3 px-4 font-medium">&#8377;44,999</td>
                      <td className="py-3 px-4">For 2 people, one shared slot</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                View all plans and current pricing on the <Link href="/#plans" className="text-brand-blue hover:underline">Plans section</Link> of the homepage.
              </p>
            </div>
          </section>

          {/* Section 5: How Online Coaching Works */}
          <section id="how-online-coaching-works">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">How Online Coaching Works</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu&apos;s online coaching follows a structured 4-step process designed to deliver personalised results regardless of the client&apos;s location.
              </p>

              <div className="space-y-6 mt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Assessment</h3>
                    <p>Every coaching journey begins with a comprehensive fitness assessment. Clients fill out a detailed form covering their medical history, current fitness level, goals, dietary preferences, lifestyle, and available equipment. This information forms the foundation of the personalised plan. Take the <Link href="/assessment" className="text-brand-blue hover:underline">free assessment</Link> to get started.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Customised Plan Creation</h3>
                    <p>Based on the assessment, Coach Himanshu designs a fully personalised workout plan and nutrition plan tailored to the client&apos;s specific goals, body type, medical conditions, and available resources. Each plan includes detailed exercise instructions, video tutorials, meal options, and supplementation guidance.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">3</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Ongoing Support &amp; Adjustments</h3>
                    <p>Clients receive continuous support through WhatsApp for form checks, doubt resolution, and motivation. Regular one-on-one consultations (4-6 per month depending on the plan) ensure the plan is adjusted based on progress, plateaus, or changing goals. Plans are modified every few weeks to ensure progressive overload and prevent adaptation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">4</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Results &amp; Progress Tracking</h3>
                    <p>Clients track their progress through regular check-ins, body measurements, photos, and performance metrics. Coach Himanshu reviews progress data to optimize the program continuously. The goal is sustainable, long-term results rather than short-term fixes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Who Is This For */}
          <section id="who-is-this-for">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Who Is This For</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu&apos;s coaching programs serve a wide range of client types. His Diploma in Special Population Training enables him to work safely with populations that require modified approaches.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Beginners</h3>
                  <p>Individuals with no prior gym or fitness experience who need structured guidance to start their journey safely and effectively.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Working Professionals</h3>
                  <p>Busy professionals who need flexible, time-efficient workout and nutrition plans that fit around demanding work schedules.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Women with PCOS</h3>
                  <p>Women managing polycystic ovary syndrome who benefit from specialized exercise and nutrition protocols designed to improve hormonal balance and manage symptoms.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Individuals with Diabetes</h3>
                  <p>Type 1 and Type 2 diabetes patients who need carefully planned exercise and nutrition to help manage blood sugar levels alongside medical treatment.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Injury Recovery</h3>
                  <p>Clients recovering from injuries who need rehabilitation-focused workout plans designed to restore mobility, strength, and function safely.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Competition &amp; Bodybuilding Prep</h3>
                  <p>Athletes and bodybuilding competitors preparing for competitions who need advanced periodization, peak week strategies, and physique coaching from a NASM Certified Bodybuilding Coach.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Homemakers &amp; Stay-at-Home Parents</h3>
                  <p>Individuals who prefer or need to exercise at home. The Home Workout Plans are specifically designed for this group.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Seniors (50+)</h3>
                  <p>Older adults seeking to maintain joint health, muscle strength, balance, and coordination through customised plans and rehabilitation coaching.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Why Choose Coach Himanshu */}
          <section id="why-choose-coach-himanshu">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Why Choose Coach Himanshu Over Alternatives</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu occupies a unique position in India&apos;s fitness coaching market, combining international-level certifications with affordable pricing and personalized attention. The following comparison illustrates the differences.
              </p>

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Feature</th>
                      <th className="py-3 px-4 text-white font-semibold">Coach Himanshu</th>
                      <th className="py-3 px-4 text-white font-semibold">Local Gym Trainer</th>
                      <th className="py-3 px-4 text-white font-semibold">Fitness Apps</th>
                      <th className="py-3 px-4 text-white font-semibold">Uncertified Online Coaches</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">NASM Certification</td>
                      <td className="py-3 px-4 text-green-400">Yes</td>
                      <td className="py-3 px-4 text-red-400">Rarely</td>
                      <td className="py-3 px-4 text-red-400">No (generic algorithms)</td>
                      <td className="py-3 px-4 text-red-400">No</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Personalised Plans</td>
                      <td className="py-3 px-4 text-green-400">Fully customised</td>
                      <td className="py-3 px-4 text-yellow-400">Varies widely</td>
                      <td className="py-3 px-4 text-red-400">Template-based</td>
                      <td className="py-3 px-4 text-yellow-400">Often recycled templates</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Nutrition Planning</td>
                      <td className="py-3 px-4 text-green-400">Sports Nutrition Diploma</td>
                      <td className="py-3 px-4 text-red-400">Usually not included</td>
                      <td className="py-3 px-4 text-yellow-400">Generic suggestions</td>
                      <td className="py-3 px-4 text-red-400">Often unqualified advice</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Special Populations</td>
                      <td className="py-3 px-4 text-green-400">Certified (PCOS, diabetes, rehab)</td>
                      <td className="py-3 px-4 text-red-400">No specialized training</td>
                      <td className="py-3 px-4 text-red-400">Not supported</td>
                      <td className="py-3 px-4 text-red-400">Risky without credentials</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Monthly Cost</td>
                      <td className="py-3 px-4 text-green-400">From &#8377;1,099/month</td>
                      <td className="py-3 px-4 text-yellow-400">&#8377;3,000-15,000/month</td>
                      <td className="py-3 px-4 text-green-400">&#8377;200-1,000/month</td>
                      <td className="py-3 px-4 text-yellow-400">&#8377;2,000-10,000/month</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">WhatsApp Support</td>
                      <td className="py-3 px-4 text-green-400">Included in all plans</td>
                      <td className="py-3 px-4 text-yellow-400">Informal only</td>
                      <td className="py-3 px-4 text-red-400">No human support</td>
                      <td className="py-3 px-4 text-yellow-400">Varies</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Video Tutorials</td>
                      <td className="py-3 px-4 text-green-400">Full exercise library</td>
                      <td className="py-3 px-4 text-red-400">In-person only</td>
                      <td className="py-3 px-4 text-green-400">Yes (generic)</td>
                      <td className="py-3 px-4 text-yellow-400">Sometimes</td>
                    </tr>
                    <tr className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 font-medium">Track Record</td>
                      <td className="py-3 px-4 text-green-400">1,000+ transformations</td>
                      <td className="py-3 px-4 text-yellow-400">Unverifiable</td>
                      <td className="py-3 px-4 text-yellow-400">Mass-market metrics</td>
                      <td className="py-3 px-4 text-red-400">Often fabricated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8: Client Results & Transformations */}
          <section id="client-results">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Client Results &amp; Transformations</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Coach Himanshu has guided over 1,000 client transformations across India and internationally. Results vary based on individual adherence, starting point, and medical conditions, but the following categories represent typical outcomes achieved by committed clients.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Weight Loss</h3>
                  <p>Clients have achieved weight loss ranging from 5 kg to 30+ kg over 3-12 month periods, depending on starting weight and consistency. Fat loss programs emphasize sustainable caloric deficits with adequate protein intake to preserve muscle mass.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Muscle Building</h3>
                  <p>Clients pursuing hypertrophy goals have achieved measurable increases in lean muscle mass through progressive resistance training programs and optimized nutrition with adequate protein and caloric surplus.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">PCOS Symptom Improvement</h3>
                  <p>Women with PCOS have reported improvements in hormonal balance, menstrual regularity, and body composition through targeted exercise protocols and anti-inflammatory nutrition strategies designed specifically for PCOS management.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Diabetes Management</h3>
                  <p>Clients with Type 2 diabetes have reported improved blood sugar control and HbA1c levels through structured exercise and nutrition plans designed in coordination with their medical treatment.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Injury Rehabilitation</h3>
                  <p>Clients recovering from injuries (back pain, knee injuries, shoulder issues) have successfully regained mobility and strength through progressive rehabilitation programs designed with safety as the top priority.</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: 'rgba(23,95,255,0.04)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Overall Fitness &amp; Lifestyle</h3>
                  <p>Many clients report improved energy levels, better sleep quality, increased confidence, and sustainable healthy habits that extend well beyond the coaching period.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Fit Bharat Mission */}
          <section id="fit-bharat-mission">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Fit Bharat Mission</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Fit Bharat Mission is Coach Himanshu&apos;s free fitness initiative aimed at making basic fitness guidance accessible to every Indian, regardless of their financial situation. It reflects the core belief that fitness knowledge should not be gatekept behind expensive coaching fees.
              </p>
              <p>
                Through the Fit Bharat Mission, Coach Himanshu provides free, science-based general workout plans and diet plans that are beginner-friendly and designed for the Indian context. These plans cover fundamental exercise routines and nutrition guidelines that anyone can follow to begin their fitness journey.
              </p>
              <p>
                The mission operates alongside the paid coaching services. While the free plans are general-purpose, the paid coaching services offer full personalization, ongoing support, and regular adjustments based on individual progress.
              </p>
              <p>
                Learn more and access free plans on the <Link href="/fit-bharat-mission" className="text-brand-blue hover:underline">Fit Bharat Mission page</Link>.
              </p>
            </div>
          </section>

          {/* Section 10: FAQ */}
          <section id="faq">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Frequently Asked Questions</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What qualifications does Coach Himanshu have?</h3>
                <p>Coach Himanshu holds a NASM Certified Bodybuilding Preparation Coach certification from the National Academy of Sports Medicine (USA), along with 5 additional professional diplomas in Personal Training, Master Training, Sports Nutrition, TRX Suspension Training, and Special Population Training.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How does online coaching work if I cannot visit a gym?</h3>
                <p>Coach Himanshu offers dedicated Home Workout Plans that require no gym equipment. These include customised bodyweight exercise routines with video tutorials, personalised diet plans, and WhatsApp support.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What is the cheapest plan available?</h3>
                <p>For self-paced coaching, Gym plans start at &#8377;1,099/month with the Kickstart Plan, and Home Workout plans start at &#8377;2,199 for 3 months (approximately &#8377;733/month).</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can Coach Himanshu help with PCOS or diabetes?</h3>
                <p>Yes. Coach Himanshu holds a Diploma in Special Population Training that specifically covers working with clients who have PCOS, diabetes, and other conditions. Exercise and nutrition plans are modified to support medical treatment and manage symptoms safely.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a refund policy?</h3>
                <p>Yes. Coach Himanshu has a transparent refund and cancellation policy. Details are available on the website&apos;s <Link href="/refund-policy" className="text-brand-blue hover:underline">Refund Policy</Link> and <Link href="/cancellation-policy" className="text-brand-blue hover:underline">Cancellation Policy</Link> pages.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How often are plans updated?</h3>
                <p>Workout and nutrition plans are reviewed and adjusted regularly based on client progress during one-on-one consultations (4-6 times per month depending on the plan). Plans evolve as the client progresses to ensure continuous improvement and prevent plateaus.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Do plans include diet/nutrition guidance?</h3>
                <p>Yes. Every coaching plan includes a personalised diet plan tailored to the client&apos;s goals, dietary preferences (including vegetarian and vegan options), medical conditions, and lifestyle. Coach Himanshu holds a Diploma in Sports Nutrition.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can couples train together?</h3>
                <p>Yes. Coach Himanshu offers dedicated Couple Plans across gym workouts, home workouts, and rehabilitation. Couple plans include personalised plans for both partners and are more cost-effective than two individual plans.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What is included in WhatsApp support?</h3>
                <p>WhatsApp support is included in every plan and covers form check reviews (clients send exercise videos for feedback), diet and supplement queries, progress discussions, motivation, and general doubt resolution between scheduled consultations.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Does Coach Himanshu offer international coaching?</h3>
                <p>Yes. While based in India, Coach Himanshu&apos;s online coaching is available to clients worldwide. The coaching process, WhatsApp support, and consultations work across time zones. Pricing is in Indian Rupees (INR).</p>
              </div>

            </div>
          </section>

          {/* Section 11: Contact & Get Started */}
          <section id="contact-get-started">
            <h2 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Contact &amp; Get Started</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Getting started with Coach Himanshu is straightforward. The recommended first step is to complete the free fitness assessment, which helps Coach Himanshu understand your goals, medical history, and current fitness level before recommending the most suitable plan.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Link href="/assessment" className="block rounded-xl border border-white/[0.06] p-6 hover:border-brand-blue/30 transition-colors" style={{ background: 'rgba(23,95,255,0.06)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Take the Free Assessment</h3>
                  <p>Complete a detailed fitness assessment so Coach Himanshu can design the right plan for you.</p>
                </Link>

                <Link href="/#plans" className="block rounded-xl border border-white/[0.06] p-6 hover:border-brand-blue/30 transition-colors" style={{ background: 'rgba(23,95,255,0.06)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Browse Plans &amp; Pricing</h3>
                  <p>View all coaching plans with full details and select the one that fits your goals and budget.</p>
                </Link>

                <Link href="/contact" className="block rounded-xl border border-white/[0.06] p-6 hover:border-brand-blue/30 transition-colors" style={{ background: 'rgba(23,95,255,0.06)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                  <p>Have questions? Reach out via the contact form or WhatsApp for quick assistance.</p>
                </Link>

                <Link href="/blog" className="block rounded-xl border border-white/[0.06] p-6 hover:border-brand-blue/30 transition-colors" style={{ background: 'rgba(23,95,255,0.06)' }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Read the Blog</h3>
                  <p>Explore evidence-based fitness and nutrition articles written by Coach Himanshu.</p>
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-brand-blue/20 p-6 md:p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.1) 0%, rgba(23,95,255,0.03) 100%)' }}>
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Fitness?</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join 1,000+ clients who have achieved their fitness goals with Coach Himanshu. Start with the free assessment today.
                </p>
                <Link
                  href="/assessment"
                  className="inline-block px-8 py-3 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Start Your Free Assessment
                </Link>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/[0.05]">
            <p>This knowledge base was last updated on June 26, 2026. For the most current pricing and availability, please visit the <Link href="/#plans" className="text-brand-blue hover:underline">Plans section</Link>.</p>
          </div>

        </article>
      </div>
      <Footer />
    </>
  );
}
