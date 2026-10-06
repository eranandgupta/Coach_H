import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContactFormEmail } from '@/lib/email';
import { sendPushToCoaches } from '@/lib/push';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, website } = body;

    // Honeypot: the landing-page form has a hidden "website" field that only bots fill in.
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to database
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'new',
      },
    });

    // Push the coach's phone/desktop so enquiries get a reply within minutes, not hours.
    void sendPushToCoaches({
      title: `New enquiry: ${subject}`,
      body: `${name}${phone ? ` · ${phone}` : ''} — ${String(message).split('\n')[0].slice(0, 120)}`,
      tag: 'enquiry',
      url: '/dashboard',
    }).catch((err) => console.error('Enquiry push failed:', err));

    // Send email notification to info@coachhimanshu.com
    try {
      await sendContactFormEmail({
        name,
        email,
        phone,
        subject,
        message,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails - we've saved to database
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        submissionId: contactSubmission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    );
  }
}
