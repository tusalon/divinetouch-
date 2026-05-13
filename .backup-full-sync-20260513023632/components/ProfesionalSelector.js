// components/ProfesionalSelector.js - Versión con filtro por servicio

function ProfesionalSelector({ onSelect, selectedProfesional, selectedService }) {
    const [profesionales, setProfesionales] = React.useState([]);
    const [cargando, setCargando] = React.useState(true);
    const [todosProfesionales, setTodosProfesionales] = React.useState([]);

    React.useEffect(() => {
        cargarTodosProfesionales();
    }, []);

    React.useEffect(() => {
        if (todosProfesionales.length > 0) {
            filtrarPorServicio();
        }
    }, [selectedService, todosProfesionales]);

    const cargarTodosProfesionales = async () => {
        setCargando(true);
        try {
            if (window.salonProfesionales) {
                const activos = await window.salonProfesionales.getAll(true);
                setTodosProfesionales(activos || []);
                filtrarPorServicio(activos || []);
            }
        } catch (error) {
            console.error('Error cargando profesionales:', error);
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorServicio = async (profesionalesList = todosProfesionales) => {
        if (!selectedService) {
            setProfesionales(profesionalesList);
            return;
        }

        try {
            console.log(`🔍 Filtrando profesionales para servicio: ${selectedService.nombre}`);
            
            if (window.getProfesionalesPorServicio) {
                const profesionalesDelServicio = await window.getProfesionalesPorServicio(selectedService.id);
                const idsDelServicio = profesionalesDelServicio.map(p => p.id);
                
                console.log(`📋 Profesionales asignados a este servicio:`, idsDelServicio);
                
                const filtrados = profesionalesList.filter(p => idsDelServicio.includes(p.id));
                setProfesionales(filtrados);
                
                if (selectedProfesional && !filtrados.find(p => p.id === selectedProfesional.id)) {
                    console.log('⚠️ Profesional seleccionado ya no disponible para este servicio');
                    onSelect(null);
                }
            } else {
                setProfesionales(profesionalesList);
            }
        } catch (error) {
            console.error('Error filtrando profesionales:', error);
            setProfesionales(profesionalesList);
        }
    };

    if (cargando) {
        return (
            <div className="space-y-4 animate-fade-in">
                <h2 className="text-lg font-semibold text-pink-700 flex items-center gap-2">
                    <span className="text-2xl">👩‍🎨</span>
                    2. Elegí tu profesional
                </h2>
                <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full mx-auto"></div>
                    <p className="text-purple-400 mt-4">Cargando profesionales...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-pink-700 flex items-center gap-2">
                <span className="text-2xl">👩‍🎨</span>
                2. Elegí tu profesional
                {selectedProfesional && (
                    <span className="text-xs bg-purple-100 text-pink-700 px-2 py-1 rounded-full ml-2">
                        ✓ Seleccionada
                    </span>
                )}
            </h2>
            
            {selectedService && profesionales.length === 0 ? (
                <div className="text-center p-8 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-5xl text-purple-600 mb-3">👥❌</div>
                    <p className="text-pink-700 font-medium">
                        No hay profesionales disponibles para "{selectedService.nombre}"
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                        El administrador debe asignar profesionales a este servicio
                    </p>
                </div>
            ) : profesionales.length === 0 ? (
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200">
                    <p className="text-purple-600">No hay profesionales disponibles</p>
                </div>
            ) : (
                <>
                    {selectedService && (
                        <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                            💡 Mostrando solo profesionales que realizan "{selectedService.nombre}"
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {profesionales.map(prof => (
                            <button
                                key={prof.id}
                                onClick={() => onSelect(prof)}
                                className={`
                                    p-4 rounded-xl border-2 text-left transition-all duration-200 transform hover:scale-105
                                    ${selectedProfesional?.id === prof.id 
                                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 shadow-lg' 
                                        : 'border-purple-200 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-md'}
                                `}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 ${prof.color || 'bg-purple-600'} rounded-full flex items-center justify-center text-3xl mb-3 shadow-md ring-2 ring-purple-300/50`}>
                                        {prof.avatar || '👩‍🎨'}
                                    </div>
                                    <span className="font-bold text-pink-800 text-lg block">
                                        {prof.nombre}
                                    </span>
                                    <span className="text-sm text-purple-600 mt-1">
                                        {prof.especialidad}
                                    </span>
                                    
                                    {selectedProfesional?.id === prof.id && (
                                        <div className="mt-2 text-purple-700 text-sm font-semibold flex items-center gap-1">
                                            <span>✅</span>
                                            Seleccionada
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
            
            <div className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="flex items-center gap-2">
                    <span className="text-purple-400 text-lg">💡</span>
                    <span>Cada profesional tiene su propia agenda. Después de elegir, podrás ver sus horarios disponibles.</span>
                </p>
            </div>
        </div>
    );
}