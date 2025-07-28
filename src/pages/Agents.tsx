const Agents = () => {
  const handleAddAgent = () => {
    setEditAgent({ id: '', name: '', email: '', phone: '', agency_id: '', photo_url: '', role: 'agent' });
    setEditModalOpen(true);
  };

  const handleSaveAgent = async (updated: Agent) => {
    if (updated.id) {
      await supabase.from('users_unificado').update(updated).eq('user_id', updated.id);
    } else {
      const { data, error } = await supabase.from('users_unificado').insert([{ ...updated, role: 'agent' }]);
      if (error) console.error(error);
    }
    setEditModalOpen(false);
    setEditAgent(null);
    // Recargar lista
    const { data } = await supabase
      .from('users_unificado')
      .select('user_id as id, full_name as name, email, phone, agency_id, photo_url, role')
      .eq('role', 'agent');
    setAgents(data || []);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Agentes inmobiliarios</h1>
      <div className="flex items-center gap-2">
        <button onClick={handleAddAgent} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Añadir agente</button>
        {/* ... filtro y vista ... */}
      </div>
    </div>
  );
};

export default Agents; 