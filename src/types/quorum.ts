/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuorumDecision = 'VERIFIED' | 'REJECTED' | 'CONFLICT' | 'IN_QUEUE' | 'RUNNING';

export interface BuilderNode {
  id: string;
  name: string;
  region: string;
  type: string;
  enclaveType: 'AWS Nitro Enclave' | 'GCP Confidential VM' | 'Baremetal Intel SGX' | 'Hetzner Baremetal';
  publicKeyId: string;
  uptime: string;
  totalBuilds: number;
  isSimulated: boolean; // Honest indication of simulated vs physical production enclave
  isRogue?: boolean;
  isQuarantined?: boolean;
}

export interface BuilderAttestation {
  builderId: string;
  builderName: string;
  region: string;
  enclaveType: string;
  isSimulated: boolean; // Explicitly labels demo/simulated vs real enclave runner
  sourceCommit: string;
  buildEnvironment: string;
  buildConfiguration: string;
  containerImageDigest: string;
  artifactHash: string;
  timestamp: string;
  publicKey: string;
  publicKeyId: string;
  signature: string;
  signatureAlgorithm: string;
  signatureVerified: boolean;
  sourceCommitMatches?: boolean; // Validated against pinned root commit
  signatureValid?: boolean; // Cryptographically validated via WebCrypto
  canonicalPayload?: string; // Canonical message representation
  matchExpected: boolean;
  elapsedSec: number;
  executionStatus: 'completed' | 'running' | 'diverged' | 'timed_out' | 'invalid_signature' | 'commit_mismatch';
  diagnosticNote?: string;
  rawSignatureBuffer?: string; // base64 / hex for WebCrypto verification
}

export interface VerificationEvidence {
  expectedHash: string;
  matchingBuilders: string[];
  mismatchingBuilders: string[];
  invalidBuilders: string[];
  divergentEvidence: Array<{
    builderId: string;
    builderName: string;
    reportedHash: string;
    varianceType: string;
  }>;
  validSignaturesCount: number;
  totalAttestations: number;
}

export interface QuorumEvaluationResult {
  decision: QuorumDecision;
  decisionReason: string;
  requiredQuorum: number;
  matchingCount: number;
  divergenceCount: number;
  invalidCount: number;
  totalAttestations: number;
  quorumSatisfied: boolean;
  expectedHash: string;
  matchingBuilders: string[];
  divergentBuilders: string[];
  invalidBuilders: string[];
}

export interface AuditEvent {
  id: string;
  verificationId: string;
  timestamp: string;
  stage:
    | 'Verification Created'
    | 'Source Pinned'
    | 'Builder Started'
    | 'Build Completed'
    | 'Artifact Hash Generated'
    | 'Attestation Received'
    | 'Signature Verified'
    | 'Hash Comparison Completed'
    | 'Quorum Evaluated'
    | 'Final Decision Recorded';
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE' | 'INFO';
}

export interface VerificationRecord {
  id: string; // e.g. QRM-2025-08942-VERIFIED
  packageName: string;
  repositoryUrl: string;
  version: string;
  pinnedCommit: string;
  artifactName: string;
  targetFormat: string; // e.g. 'NPM // TARBALL', 'BINARY // ELF', 'CARGO // CRATE'
  isSimulation: boolean;
  consensusPolicy: {
    requiredThreshold: number; // e.g. 2
    totalNodes: number; // e.g. 3
    description: string;
  };
  expectedHash?: string;
  decision: QuorumDecision;
  decisionReason: string;
  matchingCount: number;
  divergenceCount: number;
  timestamp: string;
  relativeTime: string;
  attestations: BuilderAttestation[];
  evaluation: QuorumEvaluationResult;
  auditTrail?: AuditEvent[];
  binaryDiff?: {
    file: string;
    offset: string;
    expected: string;
    actual: string;
    diffSnippet: Array<{
      line: string;
      code: string;
      type: 'context' | 'added' | 'removed';
    }>;
    explanation: string;
  };
  merkleProof?: {
    chainDepth: number;
    rootHash: string;
    zkValidated: boolean;
  };
}

export interface TestCaseResult {
  id: string;
  name: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  evidence: string;
  notes: string;
  durationMs: number;
}

export type TabType = 'dashboard' | 'releases' | 'verify' | 'tamper' | 'attest' | 'testsuite';
