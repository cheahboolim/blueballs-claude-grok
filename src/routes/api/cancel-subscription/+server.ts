import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		// Get environment variables from Cloudflare Pages
		const stripeSecretKey = (platform as any)?.env?.STRIPE_SECRET_KEY;
		const supabaseUrl = (platform as any)?.env?.PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = (platform as any)?.env?.PUBLIC_SUPABASE_ANON_KEY;
		
		if (!stripeSecretKey || !supabaseUrl || !supabaseAnonKey) {
			return json({ success: false, error: 'Configuration missing' }, { status: 500 });
		}

		const stripe = new Stripe(stripeSecretKey, {
			apiVersion: '2025-02-24.acacia'
		});

		// Get the authorization header
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// Create a Supabase client with the user's token
		const supabase = createClient(
			supabaseUrl,
			supabaseAnonKey,
			{
				global: {
					headers: {
						Authorization: authHeader
					}
				}
			}
		);

		// Get user from Supabase auth
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// Get user profile
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();

		if (profileError || !profile) {
			return json({ success: false, error: 'Profile not found' }, { status: 404 });
		}

		// Check if user has a subscription
		if (!profile.stripe_subscription_id) {
			return json({ success: false, error: 'No active subscription found' }, { status: 400 });
		}

		// Cancel the subscription at period end (user keeps access until then)
		const subscription = await stripe.subscriptions.update(
			profile.stripe_subscription_id,
			{
				cancel_at_period_end: true
			}
		);

		// Update profile to reflect cancellation
		await supabase
			.from('profiles')
			.update({
				subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString()
			})
			.eq('id', user.id);

		return json({
			success: true,
			message: 'Subscription cancelled successfully',
			endsAt: new Date(subscription.current_period_end * 1000).toISOString()
		});
	} catch (error: any) {
		console.error('Cancel subscription error:', error);
		return json({
			success: false,
			error: error.message || 'Failed to cancel subscription'
		}, { status: 500 });
	}
};
