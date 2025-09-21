import React, { useState, useEffect } from 'react';
import { 
  FiArrowUp, FiArrowDown, FiDollarSign, FiPieChart, FiCalendar,
  FiPlus, FiFilter, FiTrendingUp, FiTrendingDown, FiCreditCard, FiPocket,
  FiHome, FiShoppingBag, FiCoffee, FiSettings, FiBell, FiUser,
  FiBarChart2, FiTarget, FiX, FiMenu
} from 'react-icons/fi';

const FinanceApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0]
  });
  const [newGoal, setNewGoal] = useState({
    title: '', targetAmount: '', currentAmount: '', deadline: '', description: ''
  });

  // --- Persistência no localStorage ---
  useEffect(() => {
  const storedTransactions = localStorage.getItem("transactions");
  const storedGoals = localStorage.getItem("goals");

  if (storedTransactions) {
    try {
      const parsedTransactions = JSON.parse(storedTransactions).map(t => ({
        ...t,
        amount: Number(t.amount)  // ← garante que seja número
      }));
      setTransactions(parsedTransactions);
      calculateTotals(parsedTransactions);
    } catch (error) {
      console.error("Erro ao carregar transações do localStorage:", error);
    }
  } else {
    const sampleTransactions = [
      { id: 1, type: 'income', category: 'Salário', amount: 3500, description: 'Salário mensal', date: '2023-10-05' },
      { id: 2, type: 'expense', category: 'Alimentação', amount: 150, description: 'Supermercado', date: '2023-10-07' },
      { id: 3, type: 'expense', category: 'Transporte', amount: 200, description: 'Combustível', date: '2023-10-08' },
      { id: 4, type: 'expense', category: 'Moradia', amount: 1200, description: 'Aluguel', date: '2023-10-01' },
      { id: 5, type: 'income', category: 'Freelance', amount: 800, description: 'Projeto freelance', date: '2023-10-15' },
    ];
    setTransactions(sampleTransactions);
    calculateTotals(sampleTransactions);
  }

  if (storedGoals) {
    try {
      const parsedGoals = JSON.parse(storedGoals).map(g => ({
        ...g,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount)
      }));
      setGoals(parsedGoals);
    } catch (error) {
      console.error("Erro ao carregar metas do localStorage:", error);
    }
  } else {
    const sampleGoals = [
      { id: 1, title: 'Viagem à Praia', targetAmount: 2000, currentAmount: 1200, deadline: '2023-12-31', description: 'Meta para Dezembro/2023' },
      { id: 2, title: 'Notebook Novo', targetAmount: 3000, currentAmount: 800, deadline: '2024-03-31', description: 'Meta para Março/2024' },
    ];
    setGoals(sampleGoals);
  }
}, []);


  // Salvar no localStorage automaticamente
  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("goals", JSON.stringify(goals)); }, [goals]);

  // Fechar sidebar ao redimensionar
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsSidebarOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outros']
  };

  const calculateTotals = (transactions) => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    setIncome(totalIncome);
    setExpenses(totalExpenses);
    setBalance(totalIncome - totalExpenses);
  };

  const handleAddTransaction = () => {
  if (!newTransaction.amount || !newTransaction.category) return;

  const transaction = {
    id: Date.now(),
    ...newTransaction,
    amount: Number(newTransaction.amount)
  };

  const updatedTransactions = [transaction, ...transactions];
  setTransactions(updatedTransactions);
  calculateTotals(updatedTransactions);
  setIsAddModalOpen(false);
};

const handleAddGoal = () => {
  if (!newGoal.title || !newGoal.targetAmount) return;

  const goal = {
    id: Date.now(),
    ...newGoal,
    targetAmount: Number(newGoal.targetAmount),
    currentAmount: Number(newGoal.currentAmount) || 0
  };

  setGoals([goal, ...goals]);
  setIsAddGoalModalOpen(false);
};


  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Salário': return <FiDollarSign className="text-blue-500" />;
      case 'Freelance': return <FiPocket className="text-purple-500" />;
      case 'Investimentos': return <FiTrendingUp className="text-green-500" />;
      case 'Alimentação': return <FiCoffee className="text-red-500" />;
      case 'Transporte': return <FiCreditCard className="text-yellow-500" />;
      case 'Moradia': return <FiHome className="text-indigo-500" />;
      case 'Saúde': return <FiPocket className="text-pink-500" />;
      case 'Lazer': return <FiShoppingBag className="text-orange-500" />;
      case 'Educação': return <FiPocket className="text-blue-400" />;
      default: return <FiDollarSign className="text-gray-500" />;
    }
  };

  // Componentes de página
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Saldo Total</h3>
            <FiDollarSign className="text-blue-500" />
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Kz {balance.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Receitas</h3>
            <FiTrendingUp className="text-green-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">Kz {income.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Despesas</h3>
            <FiTrendingDown className="text-red-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600">Kz {expenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráfico de Gastos por Categoria */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
        <div className="space-y-3">
          {categories.expense.map(category => {
            const categoryTotal = transactions
              .filter(t => t.type === 'expense' && t.category === category)
              .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = expenses > 0 ? (categoryTotal / expenses) * 100 : 0;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="truncate max-w-[100px] sm:max-w-none">{category}</span>
                  </span>
                  <span className="whitespace-nowrap">Kz {categoryTotal.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Últimas Transações */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Últimas Transações</h3>
          <button 
            className="text-blue-500 text-sm hover:text-blue-700"
            onClick={() => setActiveTab('transactions')}
          >
            Ver todas
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="flex justify-between items-center p-3 border-b">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.type === 'income' ? 
                    <FiArrowUp className="text-green-500" /> : 
                    <FiArrowDown className="text-red-500" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <p className="text-sm text-gray-500 truncate">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-semibold flex-shrink-0 ml-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}Kz {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Transactions = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Todas as Transações</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center">
            <FiFilter className="flex-shrink-0" />
            <span className="hidden sm:block">Filtrar</span>
          </button>
          <button 
            className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus className="flex-shrink-0" />
            <span className="hidden sm:block">Nova Transação</span>
            <span className="sm:hidden">Nova</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma transação encontrada. Adicione sua primeira transação!
          </div>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <p className="text-sm text-gray-500 truncate">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-semibold flex-shrink-0 ml-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}Kz {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const Goals = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Metas Financeiras</h2>
        <button 
          className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
          onClick={() => setIsAddGoalModalOpen(true)}
        >
          <FiPlus className="flex-shrink-0" />
          <span className="hidden sm:block">Nova Meta</span>
          <span className="sm:hidden">Nova Meta</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {goals.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-gray-500">
            Nenhuma meta encontrada. Adicione sua primeira meta financeira!
          </div>
        ) : (
          goals.map(goal => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const progressColor = percentage >= 80 ? 'bg-green-500' : 
                                 percentage >= 50 ? 'bg-blue-500' : 'bg-yellow-500';
            
            return (
              <div key={goal.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                    <FiTarget className="text-blue-500" />
                  </div>
                  <h3 className="font-semibold truncate">{goal.title}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">Kz {goal.currentAmount.toFixed(2)} de Kz {goal.targetAmount.toFixed(2)}</span>
                    <span className="flex-shrink-0">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${progressColor}`} 
                      style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {goal.description} {goal.deadline && `• Meta para ${new Date(goal.deadline).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const Reports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Relatórios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="font-semibold mb-4">Receitas vs Despesas</h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <FiBarChart2 className="text-4xl text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="font-semibold mb-4">Evolução Mensal</h3>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-4xl text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[ #0000003d] bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative w-64 bg-white shadow-lg z-50 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 md:p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Finanças+</h1>
          <p className="text-gray-500 text-sm">Controle suas finanças</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <FiPieChart /> },
            { id: 'transactions', label: 'Transações', icon: <FiDollarSign /> },
            { id: 'goals', label: 'Metas', icon: <FiTarget /> },
            { id: 'reports', label: 'Relatórios', icon: <FiBarChart2 /> },
          ].map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-xl font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'transactions' && 'Transações'}
              {activeTab === 'goals' && 'Metas Financeiras'}
              {activeTab === 'reports' && 'Relatórios'}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <FiBell size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <FiSettings size={20} />
            </button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="text-blue-600" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'goals' && <Goals />}
          {activeTab === 'reports' && <Reports />}
        </main>
      </div>

      {/* Modal para Nova Transação */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[ #0000003d] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Transação</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 p-3 rounded-lg border transition-colors text-sm sm:text-base ${
                      newTransaction.type === 'income' 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                  >
                    Receita
                  </button>
                  <button
                    className={`flex-1 p-3 rounded-lg border transition-colors text-sm sm:text-base ${
                      newTransaction.type === 'expense' 
                        ? 'bg-red-100 border-red-500 text-red-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories[newTransaction.type].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (Kz)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="0,00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Ex: Supermercado mensal"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>

              <button
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                onClick={handleAddTransaction}
              >
                Adicionar Transação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Nova Meta */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 bg-[ #0000003d] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nova Meta Financeira</h3>
              <button 
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Meta</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Ex: Viagem à Europa"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Alvo (Kz)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="0,00"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Atual (Kz)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="0,00"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Limite</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Ex: Economizar para viagem de férias"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  rows={3}
                />
              </div>

              <button
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                onClick={handleAddGoal}
              >
                Adicionar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApp;