export type Plan = 'free' | 'pro'
export type PlanStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type Role = 'user' | 'admin'

export interface UserState {
  id: string | null
  email: string | null
  emailVerified: boolean
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  role: Role
  createdAt: string | null

  // Subscription/billing
  plan: Plan
  planStatus: PlanStatus
  trialEndsAt: string | null
  subscriptionEndsAt: string | null
}

const defaultState: UserState = {
  id: null,
  email: null,
  emailVerified: false,
  firstName: null,
  lastName: null,
  avatarUrl: null,
  role: 'user',
  createdAt: null,

  plan: 'free',
  planStatus: 'active',
  trialEndsAt: null,
  subscriptionEndsAt: null
}

function createUserStore() {
  let state = $state<UserState>({ ...defaultState })

  const isPro = $derived(state.plan === 'pro' && state.planStatus === 'active')
  const isTrialing = $derived(state.planStatus === 'trialing')
  const fullName = $derived(
    [state.firstName, state.lastName].filter(Boolean).join(' ') || null
  )

  function set(userData: Partial<UserState>) {
    Object.assign(state, userData)
  }

  function clear() {
    Object.assign(state, defaultState)
  }

  function updateProfile(profile: Pick<UserState, 'firstName' | 'lastName' | 'avatarUrl'>) {
    state.firstName = profile.firstName
    state.lastName = profile.lastName
    state.avatarUrl = profile.avatarUrl
  }

  function updateSubscription(subscription: Pick<UserState, 'plan' | 'planStatus' | 'trialEndsAt' | 'subscriptionEndsAt'>) {
    state.plan = subscription.plan
    state.planStatus = subscription.planStatus
    state.trialEndsAt = subscription.trialEndsAt
    state.subscriptionEndsAt = subscription.subscriptionEndsAt
  }

  return {
    get id() { return state.id },
    get email() { return state.email },
    get emailVerified() { return state.emailVerified },
    get firstName() { return state.firstName },
    get lastName() { return state.lastName },
    get avatarUrl() { return state.avatarUrl },
    get role() { return state.role },
    get createdAt() { return state.createdAt },
    get plan() { return state.plan },
    get planStatus() { return state.planStatus },
    get trialEndsAt() { return state.trialEndsAt },
    get subscriptionEndsAt() { return state.subscriptionEndsAt },

    get isPro() { return isPro },
    get isTrialing() { return isTrialing },
    get fullName() { return fullName },

    set,
    clear,
    updateProfile,
    updateSubscription
  }
}

export const user = createUserStore()
