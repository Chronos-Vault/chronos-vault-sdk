/**
 * Example React Native App using Chronos Vault SDK
 * 
 * This shows how developers would integrate your existing Chronos Vault
 * functionality into their mobile applications.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';

import ChronosVaultSDK, {
  Vault,
  WalletConnection,
  SecurityStatus,
  VaultConfig
} from './ChronosVaultSDK';

// Initialize SDK with your server endpoint
const sdk = new ChronosVaultSDK({
  apiEndpoint: 'https://api.chronosvault.org',
  enableBiometrics: true,
  enableEncryption: true,
  debugMode: true
});

const ChronosVaultApp: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [connectedWallets, setConnectedWallets] = useState<WalletConnection[]>([]);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      setLoading(true);
      await sdk.initialize();
      setIsInitialized(true);
      
      // Try to authenticate user
      const authenticated = await sdk.authenticate();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        await loadUserData();
      }
    } catch (error) {
      Alert.alert('Initialization Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      // Load vaults, wallets, and security status
      const [userVaults, wallets, status] = await Promise.all([
        sdk.getVaults(),
        sdk.getConnectedWallets(),
        sdk.getSecurityStatus()
      ]);

      setVaults(userVaults);
      setConnectedWallets(wallets);
      setSecurityStatus(status);
    } catch (error) {
      Alert.alert('Failed to load data', error.message);
    }
  };

  const handleConnectWallet = async (walletType: 'metamask' | 'phantom' | 'tonkeeper') => {
    try {
      setLoading(true);
      const connection = await sdk.connectWallet(walletType);
      
      Alert.alert(
        'Wallet Connected',
        `Successfully connected to ${walletType}\nAddress: ${connection.address.slice(0, 6)}...${connection.address.slice(-4)}`
      );
      
      await loadUserData();
    } catch (error) {
      Alert.alert('Connection Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVault = async () => {
    try {
      setLoading(true);
      
      const vaultConfig: VaultConfig = {
        name: 'My Mobile Vault',
        type: 'personal',
        assets: ['ETH', 'SOL', 'TON'],
        securityLevel: 'enhanced'
      };

      const newVault = await sdk.createVault(vaultConfig);
      
      Alert.alert(
        'Vault Created',
        `Successfully created vault: ${newVault.name}`
      );
      
      await loadUserData();
    } catch (error) {
      Alert.alert('Creation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (vaultId: string) => {
    try {
      setLoading(true);
      
      const transferConfig = {
        to: '0x742d35Cc6634C0532925a3b8D46C0Ac5c2A4C0c0',
        amount: '0.1',
        asset: 'ETH',
        memo: 'Test transfer from mobile app'
      };

      const txId = await sdk.transfer(vaultId, transferConfig);
      
      Alert.alert(
        'Transfer Initiated',
        `Transaction ID: ${txId.slice(0, 10)}...`
      );
    } catch (error) {
      Alert.alert('Transfer Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Initializing Chronos Vault...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Chronos Vault</Text>
          <Text style={styles.subtitle}>Secure Digital Asset Management</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => initializeSDK()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Authenticating...' : 'Authenticate with Biometrics'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chronos Vault</Text>
        {securityStatus && (
          <View style={styles.securityBadge}>
            <Text style={styles.securityScore}>
              Security: {securityStatus.overallScore}%
            </Text>
          </View>
        )}
      </View>

      {/* Wallet Connections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Wallets ({connectedWallets.length})</Text>
        <View style={styles.walletButtons}>
          <TouchableOpacity
            style={[styles.walletButton, styles.metamaskButton]}
            onPress={() => handleConnectWallet('metamask')}
            disabled={loading}
          >
            <Text style={styles.walletButtonText}>MetaMask</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.walletButton, styles.phantomButton]}
            onPress={() => handleConnectWallet('phantom')}
            disabled={loading}
          >
            <Text style={styles.walletButtonText}>Phantom</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.walletButton, styles.tonButton]}
            onPress={() => handleConnectWallet('tonkeeper')}
            disabled={loading}
          >
            <Text style={styles.walletButtonText}>TON Keeper</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vaults List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Vaults ({vaults.length})</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateVault}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>Create Vault</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={vaults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.vaultCard}>
              <View style={styles.vaultHeader}>
                <Text style={styles.vaultName}>{item.name}</Text>
                <View style={[
                  styles.statusBadge,
                  item.status === 'active' ? styles.activeBadge : styles.lockedBadge
                ]}>
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.vaultType}>{item.type} vault</Text>
              <Text style={styles.vaultBalance}>Balance: {item.balance}</Text>
              <Text style={styles.vaultSecurity}>Security: {item.securityLevel}</Text>
              
              <View style={styles.vaultActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleTransfer(item.id)}
                  disabled={loading || item.status !== 'active'}
                >
                  <Text style={styles.actionButtonText}>Transfer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.lockButton]}
                  onPress={() => sdk.lockVault(item.id)}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {item.status === 'active' ? 'Lock' : 'Unlock'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No vaults yet</Text>
              <Text style={styles.emptySubtext}>Create your first secure vault</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b0d',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1b1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#8a8a8a',
    marginBottom: 30,
  },
  securityBadge: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  securityScore: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  walletButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metamaskButton: {
    backgroundColor: '#f6851b',
  },
  phantomButton: {
    backgroundColor: '#ab9ff2',
  },
  tonButton: {
    backgroundColor: '#0088cc',
  },
  walletButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  vaultCard: {
    backgroundColor: '#1a1b1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2b2e',
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#10b981',
  },
  lockedBadge: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vaultType: {
    fontSize: 12,
    color: '#8a8a8a',
    marginBottom: 4,
  },
  vaultBalance: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  vaultSecurity: {
    fontSize: 12,
    color: '#6366f1',
    marginBottom: 12,
  },
  vaultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  lockButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8a8a8a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#5a5a5a',
  },
});

export default ChronosVaultApp;