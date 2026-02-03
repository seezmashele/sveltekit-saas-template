<script lang="ts">
    import { auth } from "$lib/stores/auth.svelte";
    import { goto } from "$app/navigation";
    import Nav from "$lib/components/layout/Nav.svelte";

    $effect(() => {
        if (auth.isAuthenticated) {
            goto('/dashboard')
        }
    })

    const features = [
        {
            title: "Lightning Fast",
            description: "Built for speed with optimized performance that keeps your workflow moving.",
            icon: "⚡"
        },
        {
            title: "Secure by Default",
            description: "Enterprise-grade security with end-to-end encryption for all your data.",
            icon: "🔒"
        },
        {
            title: "Team Collaboration",
            description: "Work together seamlessly with real-time sync and shared workspaces.",
            icon: "👥"
        },
        {
            title: "Analytics Dashboard",
            description: "Get actionable insights with powerful analytics and reporting tools.",
            icon: "📊"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for getting started",
            features: ["Up to 3 projects", "Basic analytics", "Community support"]
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            description: "For growing teams",
            features: ["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "$49",
            period: "/month",
            description: "For large organizations",
            features: ["Everything in Pro", "Custom integrations", "Dedicated support", "SLA guarantee"]
        }
    ];
</script>

<Nav />

<!-- Hero Section -->
<section class="px-5 py-24 text-center">
    <div class="max-w-3xl mx-auto">
        <h1 class="text-5xl font-bold text-neutral-900 mb-6">
            Build better products, faster
        </h1>
        <p class="text-xl text-neutral-600 mb-8">
            The all-in-one platform that helps teams ship quality software.
            Streamline your workflow, collaborate effortlessly, and scale with confidence.
        </p>
        <div class="flex gap-4 justify-center">
            <a href="/signup" class="btn btn-primary text-white px-6">Get Started Free</a>
            <a href="#features" class="btn px-6">Learn More</a>
        </div>
    </div>
</section>

<!-- Features Section -->
<section id="features" class="px-5 py-20 bg-neutral-50">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">Everything you need</h2>
        <p class="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
            Powerful features designed to help you build, launch, and grow your product.
        </p>
        <div class="grid md:grid-cols-2 gap-8">
            {#each features as feature}
                <div class="bg-white p-6 rounded-xl border border-neutral-200">
                    <span class="text-3xl mb-4 block">{feature.icon}</span>
                    <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p class="text-neutral-600">{feature.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section id="pricing" class="px-5 py-20">
    <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
        <p class="text-neutral-600 text-center mb-12">
            Start free, upgrade when you're ready.
        </p>
        <div class="grid md:grid-cols-3 gap-6">
            {#each pricingPlans as plan}
                <div class="p-6 rounded-xl border-2 {plan.popular ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 bg-white'}">
                    {#if plan.popular}
                        <span class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Most Popular</span>
                    {/if}
                    <h3 class="text-xl font-semibold mt-2">{plan.name}</h3>
                    <div class="mt-4 mb-2">
                        <span class="text-4xl font-bold">{plan.price}</span>
                        {#if plan.period}
                            <span class="text-neutral-500">{plan.period}</span>
                        {/if}
                    </div>
                    <p class="text-neutral-600 text-sm mb-6">{plan.description}</p>
                    <ul class="space-y-3 mb-6">
                        {#each plan.features as feature}
                            <li class="flex items-center gap-2 text-sm">
                                <span class="text-green-600">✓</span>
                                {feature}
                            </li>
                        {/each}
                    </ul>
                    <a href="/signup" class="btn {plan.popular ? 'btn-primary text-white' : ''} w-full justify-center">
                        Get Started
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="px-5 py-20 bg-neutral-900 text-white">
    <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p class="text-neutral-400 mb-8">
            Join thousands of teams already building better products with our platform.
        </p>
        <a href="/signup" class="btn btn-primary text-white px-8">Start Free Trial</a>
    </div>
</section>

<!-- Footer -->
<footer class="px-5 py-12 border-t border-neutral-200">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="h-8 w-40 bg-blue-100"></div>
        <div class="flex gap-6 text-sm text-neutral-600">
            <a href="#" class="hover:text-neutral-900">Privacy</a>
            <a href="#" class="hover:text-neutral-900">Terms</a>
            <a href="#" class="hover:text-neutral-900">Contact</a>
        </div>
        <p class="text-sm text-neutral-500">© 2025 YourSaaS. All rights reserved.</p>
    </div>
</footer>