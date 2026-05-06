import { supabase } from '../config/supabase'

// ===== USERS =====
export async function createUser(nom: string, email: string, telephone: string, role: string = 'adhérent') {
  const { data, error } = await supabase
    .from('users')
    .insert([{ nom, email, telephone, role }])
    .select()
  
  if (error) throw error
  return data
}

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// ===== COOPERATIVES =====
export async function createCooperative(nom: string, objectif_financier: number, admin_id: string) {
  const { data, error } = await supabase
    .from('cooperatives')
    .insert([{ nom, objectif_financier, admin_id }])
    .select()
  
  if (error) throw error
  return data
}

export async function getCooperative(id: string) {
  const { data, error } = await supabase
    .from('cooperatives')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getAllCooperatives() {
  const { data, error } = await supabase
    .from('cooperatives')
    .select('*')
  
  if (error) throw error
  return data
}

// ===== CONTRIBUTIONS =====
export async function createContribution(user_id: string, cooperative_id: string, montant: number, transaction_id: string = '', status: string = 'pending') {
  const { data, error } = await supabase
    .from('contributions')
    .insert([{ user_id, cooperative_id, montant, transaction_id, status }])
    .select()
  
  if (error) throw error
  return data
}

export async function getContributions(cooperative_id: string) {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .eq('cooperative_id', cooperative_id)
  
  if (error) throw error
  return data
}

// ===== MEMBERSHIPS =====
export async function addMembership(user_id: string, cooperative_id: string, role: string) {
  const { data, error } = await supabase
    .from('memberships')
    .insert([{ user_id, cooperative_id, role }])
    .select()
  
  if (error) throw error
  return data
}

export async function getMembers(cooperative_id: string) {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, users(*)')
    .eq('cooperative_id', cooperative_id)
  
  if (error) throw error
  return data
}
