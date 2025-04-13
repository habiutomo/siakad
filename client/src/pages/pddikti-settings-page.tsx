import React, { useState } from 'react';
import { LayoutWithSidebar } from '@/components/layout-with-sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  Lock,
  Server,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Key,
  Globe,
  Clock,
  Building,
  Network,
  Database,
  Users,
  BookOpen,
  Milestone,
  BriefcaseIcon,
  FileText,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

// Interface untuk pengaturan PDDikti
interface PDDiktiSettings {
  apiUrl: string;
  username: string;
  password: string;
  apiKey: string;
  institutionCode: string;
  autoSync: boolean;
  syncSchedule: 'daily' | 'weekly' | 'manual';
  syncTime: string;
  syncDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  validateBeforeSync: boolean;
  validationMode: 'strict' | 'relaxed';
  autoRetry: boolean;
  maxRetries: number;
  notifyOnError: boolean;
  notifyEmail: string;
  logRetention: number;
  syncEntities: {
    students: boolean;
    lecturers: boolean;
    courses: boolean;
    studyPrograms: boolean;
    activities: boolean;
    publications: boolean;
    achievements: boolean;
  };
}

// Data pengaturan awal
const initialSettings: PDDiktiSettings = {
  apiUrl: 'https://api.pddikti.kemdikbud.go.id/neofeeder/rest/v1',
  username: 'admin@kampus.ac.id',
  password: '',
  apiKey: '',
  institutionCode: '042001',
  autoSync: true,
  syncSchedule: 'daily',
  syncTime: '01:00',
  validateBeforeSync: true,
  validationMode: 'strict',
  autoRetry: true,
  maxRetries: 3,
  notifyOnError: true,
  notifyEmail: 'admin@kampus.ac.id',
  logRetention: 30,
  syncEntities: {
    students: true,
    lecturers: true,
    courses: true,
    studyPrograms: true,
    activities: true,
    publications: false,
    achievements: false,
  },
};

export default function PDDiktiSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PDDiktiSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
  const [apiKeyType, setApiKeyType] = useState<'password' | 'text'>('password');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Handler untuk perubahan pengaturan
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan pada select
  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan pada switch
  const handleSwitchChange = (name: string, checked: boolean) => {
    // Handle nested properties like syncEntities.students
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings((prev) => {
        if (parent === 'syncEntities') {
          return {
            ...prev,
            syncEntities: {
              ...prev.syncEntities,
              [child]: checked,
            },
          };
        }
        return prev;
      });
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Handler untuk toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordType(showPassword ? 'password' : 'text');
  };

  // Handler untuk toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
    setApiKeyType(showApiKey ? 'password' : 'text');
  };

  // Handler untuk test koneksi
  const handleTestConnection = () => {
    setIsTesting(true);
    setTestStatus('testing');

    // Simulasi test koneksi
    setTimeout(() => {
      setIsTesting(false);
      // Simulasi sukses
      setTestStatus('success');
      toast({
        title: 'Koneksi berhasil',
        description: 'Berhasil terhubung dengan server PDDikti',
      });
    }, 2000);
  };

  // Handler untuk simpan pengaturan
  const handleSaveSettings = () => {
    // Simulasi menyimpan data
    toast({
      title: 'Pengaturan disimpan',
      description: 'Konfigurasi PDDikti berhasil disimpan',
    });
  };

  // Render status test koneksi
  const renderTestStatus = () => {
    switch (testStatus) {
      case 'testing':
        return (
          <div className="flex items-center text-yellow-500">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            <span>Menguji koneksi...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <span>Koneksi berhasil</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Koneksi gagal</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan PDDikti</h1>
            <p className="text-muted-foreground">
              Konfigurasi integrasi dengan Neo Feeder PDDikti
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
              <Server className="h-4 w-4 mr-2" /> Test Koneksi
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" /> Simpan Pengaturan
            </Button>
          </div>
        </div>

        {testStatus !== 'idle' && (
          <div className="bg-muted p-3 rounded-md">
            {renderTestStatus()}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="sync">Sinkronisasi</TabsTrigger>
            <TabsTrigger value="entities">Entitas</TabsTrigger>
            <TabsTrigger value="advanced">Lanjutan</TabsTrigger>
          </TabsList>

          {/* Tab Pengaturan Umum */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Koneksi</CardTitle>
                <CardDescription>
                  Konfigurasi koneksi ke server Neo Feeder PDDikti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">URL API</Label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="apiUrl"
                      name="apiUrl"
                      value={settings.apiUrl}
                      onChange={handleInputChange}
                      placeholder="https://api.pddikti.kemdikbud.go.id/neofeeder/rest/v1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionCode">Kode Perguruan Tinggi</Label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="institutionCode"
                      name="institutionCode"
                      value={settings.institutionCode}
                      onChange={handleInputChange}
                      placeholder="Contoh: 042001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      value={settings.username}
                      onChange={handleInputChange}
                      placeholder="admin@kampus.ac.id"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="relative w-full">
                      <Input
                        id="password"
                        name="password"
                        type={passwordType}
                        value={settings.password}
                        onChange={handleInputChange}
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="relative w-full">
                      <Input
                        id="apiKey"
                        name="apiKey"
                        type={apiKeyType}
                        value={settings.apiKey}
                        onChange={handleInputChange}
                        placeholder="PDDikti API Key"
                      />
                      <button
                        type="button"
                        onClick={toggleApiKeyVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pengaturan Sinkronisasi */}
          <TabsContent value="sync" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sinkronisasi</CardTitle>
                <CardDescription>
                  Konfigurasi jadwal dan metode sinkronisasi data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoSync">Sinkronisasi Otomatis</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan sinkronisasi otomatis terjadwal
                    </p>
                  </div>
                  <Switch
                    id="autoSync"
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => handleSwitchChange('autoSync', checked)}
                  />
                </div>

                {settings.autoSync && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="syncSchedule">Jadwal Sinkronisasi</Label>
                      <Select
                        value={settings.syncSchedule}
                        onValueChange={(value) => handleSelectChange('syncSchedule', value)}
                      >
                        <SelectTrigger className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Pilih jadwal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.syncSchedule === 'weekly' && (
                      <div className="space-y-2">
                        <Label htmlFor="syncDay">Hari Sinkronisasi</Label>
                        <Select
                          value={settings.syncDay || 'monday'}
                          onValueChange={(value) => handleSelectChange('syncDay', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih hari" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Senin</SelectItem>
                            <SelectItem value="tuesday">Selasa</SelectItem>
                            <SelectItem value="wednesday">Rabu</SelectItem>
                            <SelectItem value="thursday">Kamis</SelectItem>
                            <SelectItem value="friday">Jumat</SelectItem>
                            <SelectItem value="saturday">Sabtu</SelectItem>
                            <SelectItem value="sunday">Minggu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {settings.syncSchedule !== 'manual' && (
                      <div className="space-y-2">
                        <Label htmlFor="syncTime">Waktu Sinkronisasi</Label>
                        <Input
                          id="syncTime"
                          name="syncTime"
                          type="time"
                          value={settings.syncTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="validateBeforeSync">Validasi Sebelum Sinkronisasi</Label>
                    <p className="text-sm text-muted-foreground">
                      Lakukan validasi data sebelum sinkronisasi
                    </p>
                  </div>
                  <Switch
                    id="validateBeforeSync"
                    checked={settings.validateBeforeSync}
                    onCheckedChange={(checked) => handleSwitchChange('validateBeforeSync', checked)}
                  />
                </div>

                {settings.validateBeforeSync && (
                  <div className="space-y-2">
                    <Label htmlFor="validationMode">Mode Validasi</Label>
                    <Select
                      value={settings.validationMode}
                      onValueChange={(value) => handleSelectChange('validationMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mode validasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Ketat (Batalkan jika ada error)</SelectItem>
                        <SelectItem value="relaxed">Longgar (Lanjutkan meskipun ada error)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pengaturan Entitas */}
          <TabsContent value="entities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Entitas</CardTitle>
                <CardDescription>
                  Pilih entitas yang akan disinkronisasi dengan PDDikti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="syncEntities.students">Mahasiswa</Label>
                  </div>
                  <Switch
                    id="syncEntities.students"
                    checked={settings.syncEntities.students}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.students', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <Label htmlFor="syncEntities.lecturers">Dosen</Label>
                  </div>
                  <Switch
                    id="syncEntities.lecturers"
                    checked={settings.syncEntities.lecturers}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.lecturers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="syncEntities.courses">Mata Kuliah</Label>
                  </div>
                  <Switch
                    id="syncEntities.courses"
                    checked={settings.syncEntities.courses}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.courses', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-yellow-600" />
                    <Label htmlFor="syncEntities.studyPrograms">Program Studi</Label>
                  </div>
                  <Switch
                    id="syncEntities.studyPrograms"
                    checked={settings.syncEntities.studyPrograms}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.studyPrograms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-600" />
                    <Label htmlFor="syncEntities.activities">Aktivitas</Label>
                  </div>
                  <Switch
                    id="syncEntities.activities"
                    checked={settings.syncEntities.activities}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.activities', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-pink-600" />
                    <Label htmlFor="syncEntities.publications">Publikasi</Label>
                  </div>
                  <Switch
                    id="syncEntities.publications"
                    checked={settings.syncEntities.publications}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.publications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Milestone className="h-4 w-4 text-indigo-600" />
                    <Label htmlFor="syncEntities.achievements">Prestasi</Label>
                  </div>
                  <Switch
                    id="syncEntities.achievements"
                    checked={settings.syncEntities.achievements}
                    onCheckedChange={(checked) => handleSwitchChange('syncEntities.achievements', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pengaturan Lanjutan */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Lanjutan</CardTitle>
                <CardDescription>
                  Konfigurasi lanjutan untuk sinkronisasi PDDikti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRetry">Coba Ulang Otomatis</Label>
                    <p className="text-sm text-muted-foreground">
                      Coba ulang sinkronisasi secara otomatis jika gagal
                    </p>
                  </div>
                  <Switch
                    id="autoRetry"
                    checked={settings.autoRetry}
                    onCheckedChange={(checked) => handleSwitchChange('autoRetry', checked)}
                  />
                </div>

                {settings.autoRetry && (
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries">Maksimum Percobaan Ulang</Label>
                    <Input
                      id="maxRetries"
                      name="maxRetries"
                      type="number"
                      min={1}
                      max={10}
                      value={settings.maxRetries}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnError">Notifikasi Error</Label>
                    <p className="text-sm text-muted-foreground">
                      Kirim notifikasi email saat terjadi error
                    </p>
                  </div>
                  <Switch
                    id="notifyOnError"
                    checked={settings.notifyOnError}
                    onCheckedChange={(checked) => handleSwitchChange('notifyOnError', checked)}
                  />
                </div>

                {settings.notifyOnError && (
                  <div className="space-y-2">
                    <Label htmlFor="notifyEmail">Email Notifikasi</Label>
                    <Input
                      id="notifyEmail"
                      name="notifyEmail"
                      type="email"
                      value={settings.notifyEmail}
                      onChange={handleInputChange}
                      placeholder="admin@kampus.ac.id"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="logRetention">Retensi Log (hari)</Label>
                  <Input
                    id="logRetention"
                    name="logRetention"
                    type="number"
                    min={1}
                    value={settings.logRetention}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Batal</Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" /> Simpan Pengaturan
          </Button>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}