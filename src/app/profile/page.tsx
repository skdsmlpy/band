"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { MOCK_STUDENTS } from "@/lib/mockBandData";

// Digital Signature Component
function DigitalSignature({ onSave }: { onSave: (signature: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1f2937';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    const newSignatures = [...signatures, dataURL].slice(-3); // Keep only last 3
    setSignatures(newSignatures);
    onSave(dataURL);
    clearSignature();
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Create Signature</h4>
          <div className="flex gap-2">
            <button 
              onClick={clearSignature}
              className="btn-secondary text-sm px-3 py-1"
            >
              Clear
            </button>
            <button 
              onClick={saveSignature}
              className="btn-primary text-sm px-3 py-1"
            >
              Save
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="w-full h-32 bg-white border rounded cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <p className="text-xs text-gray-600 mt-2">Draw your signature above using mouse or finger</p>
      </div>
      
      {signatures.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Saved Signatures ({signatures.length}/3)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {signatures.map((sig, index) => (
              <div key={index} className="border rounded-lg p-2 bg-white">
                <img src={sig} alt={`Signature ${index + 1}`} className="w-full h-16 object-contain" />
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(sig)}
                    className="flex-1 btn-secondary text-xs"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => setSignatures(signatures.filter((_, i) => i !== index))}
                    className="flex-1 btn-secondary text-xs text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    taskReminders: true,
    eventUpdates: true,
    equipmentAlerts: true
  });

  // Get student info if user is a student
  const student = user?.role === 'Student' ? 
    MOCK_STUDENTS.find(s => s.email === user?.email) : null;

  const handleSignatureSave = (signature: string) => {
    console.log('Signature saved:', signature);
    // In real app, would save to backend
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      dispatch(logout());
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'material-symbols:person' },
    { id: 'signature', label: 'Signature', icon: 'material-symbols:draw' },
    { id: 'settings', label: 'Settings', icon: 'material-symbols:settings' },
    { id: 'notifications', label: 'Notifications', icon: 'material-symbols:notifications' }
  ];

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Profile</h1>
            <button 
              onClick={handleLogout}
              className="btn-secondary"
            >
              <Icon icon="material-symbols:logout" className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {user?.role}
                  </span>
                  {student && (
                    <>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Grade {student.gradeLevel}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm capitalize">
                        {student.bandSection}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-First Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Tab Headers - Horizontal scroll on mobile */}
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon icon={tab.icon} className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={user?.name || ''} 
                          className="input-field" 
                          readOnly 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={user?.email || ''} 
                          className="input-field" 
                          readOnly 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input 
                          type="text" 
                          value={user?.role || ''} 
                          className="input-field" 
                          readOnly 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                        <input 
                          type="text" 
                          value={user?.id || ''} 
                          className="input-field" 
                          readOnly 
                        />
                      </div>
                    </div>
                  </div>

                  {student && (
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Student Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                          <input 
                            type="text" 
                            value={`Grade ${student.gradeLevel}`} 
                            className="input-field" 
                            readOnly 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Band Section</label>
                          <input 
                            type="text" 
                            value={student.bandSection} 
                            className="input-field capitalize" 
                            readOnly 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Instrument</label>
                          <input 
                            type="text" 
                            value={student.primaryInstrument} 
                            className="input-field capitalize" 
                            readOnly 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Academic Standing</label>
                          <input 
                            type="text" 
                            value={student.academicStanding.replace('_', ' ')} 
                            className="input-field capitalize" 
                            readOnly 
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Parent Contact</label>
                          <input 
                            type="email" 
                            value={student.parentContact} 
                            className="input-field" 
                            readOnly 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Equipment History</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">{student.equipmentHistory.length} items used</p>
                          <div className="flex flex-wrap gap-2">
                            {student.equipmentHistory.map(qr => (
                              <span key={qr} className="px-2 py-1 bg-white text-gray-700 rounded text-xs font-mono">
                                {qr}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Digital Signature Tab */}
              {activeTab === 'signature' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Digital Signature</h3>
                    <p className="text-gray-600 mb-6">Create and manage your digital signatures for equipment checkout, forms, and approvals.</p>
                  </div>
                  <DigitalSignature onSave={handleSignatureSave} />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Icon icon="material-symbols:info" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Signature Usage</h4>
                        <p className="text-sm text-blue-800">
                          Your digital signatures will be used for equipment checkout forms, permission slips, and other official band documents. You can store up to 3 signatures.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Application Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select 
                          value={theme} 
                          onChange={(e) => setTheme(e.target.value)} 
                          className="input-field w-full sm:w-48"
                        >
                          <option value="system">System Default</option>
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                        </select>
                        <p className="text-sm text-gray-600 mt-1">Choose how the app appears</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select className="input-field w-full sm:w-48">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                        <p className="text-sm text-gray-600 mt-1">Select your preferred language</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                        <select className="input-field w-full sm:w-60">
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Privacy & Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add extra security to your account</p>
                        </div>
                        <button className="btn-secondary text-sm">
                          Enable
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Session Timeout</h4>
                          <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                        </div>
                        <select className="input-field w-32">
                          <option value="30">30 min</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Notification Preferences</h3>
                    <p className="text-gray-600 mb-6">Choose how you want to receive notifications and updates.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Delivery Methods</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                        { key: 'sms', label: 'SMS Alerts', desc: 'Text messages for urgent updates' }
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{label}</h5>
                            <p className="text-sm text-gray-600">{desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Notification Types</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'taskReminders', label: 'Task Reminders', desc: 'Upcoming tasks and deadlines' },
                        { key: 'eventUpdates', label: 'Event Updates', desc: 'Concert and rehearsal changes' },
                        { key: 'equipmentAlerts', label: 'Equipment Alerts', desc: 'Equipment due dates and maintenance' }
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{label}</h5>
                            <p className="text-sm text-gray-600">{desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-primary">
                      <Icon icon="material-symbols:save" className="w-4 h-4 mr-2" />
                      Save Preferences
                    </button>
                    <button className="btn-secondary">
                      <Icon icon="material-symbols:refresh" className="w-4 h-4 mr-2" />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
