
<#
 # Implicit remoting module
 # generated on 11/16/2026 12:25:29 PM
 # by Export-PSSession cmdlet
 # Invoked with the following command line: 
 #>
        
param(
    <# Optional parameter that can be used to specify the session on which this proxy module works #>
    [System.Management.Automation.Runspaces.PSSession] $PSSessionOverride,
    [System.Management.Automation.Remoting.PSSessionOption] $PSSessionOptionOverride
)

$script:__psImplicitRemoting_versionOfScriptGenerator = [Microsoft.PowerShell.Commands.ExportPSSessionCommand, Microsoft.PowerShell.Commands.Utility]::VersionOfScriptGenerator
if ($script:__psImplicitRemoting_versionOfScriptGenerator.Major -ne 1.0)
{
    throw 'The module cannot be loaded because it has been generated with an incompatible version of the Export-PSSession cmdlet. Generate the module with the Export-PSSession cmdlet from the current session, and try loading the module again.'
}

$script:WriteHost = $executionContext.InvokeCommand.GetCommand('Write-Host', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:WriteWarning = $executionContext.InvokeCommand.GetCommand('Write-Warning', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:WriteInformation = $executionContext.InvokeCommand.GetCommand('Write-Information', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:GetPSSession = $executionContext.InvokeCommand.GetCommand('Get-PSSession', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:NewPSSession = $executionContext.InvokeCommand.GetCommand('New-PSSession', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:ConnectPSSession = $executionContext.InvokeCommand.GetCommand('Connect-PSSession', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:NewObject = $executionContext.InvokeCommand.GetCommand('New-Object', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:RemovePSSession = $executionContext.InvokeCommand.GetCommand('Remove-PSSession', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:InvokeCommand = $executionContext.InvokeCommand.GetCommand('Invoke-Command', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:SetItem = $executionContext.InvokeCommand.GetCommand('Set-Item', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:ImportCliXml = $executionContext.InvokeCommand.GetCommand('Import-CliXml', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:NewPSSessionOption = $executionContext.InvokeCommand.GetCommand('New-PSSessionOption', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:JoinPath = $executionContext.InvokeCommand.GetCommand('Join-Path', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:ExportModuleMember = $executionContext.InvokeCommand.GetCommand('Export-ModuleMember', [System.Management.Automation.CommandTypes]::Cmdlet)
$script:SetAlias = $executionContext.InvokeCommand.GetCommand('Set-Alias', [System.Management.Automation.CommandTypes]::Cmdlet)

$script:MyModule = $MyInvocation.MyCommand.ScriptBlock.Module
        
##############################################################################

function Write-PSImplicitRemotingMessage
{
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [string]
        $message)

    try { & $script:WriteHost -Object $message -ErrorAction SilentlyContinue } catch { }
}

function Get-PSImplicitRemotingSessionOption
{
    if ($null -ne $PSSessionOptionOverride)
    {
        return $PSSessionOptionOverride
    }
    else
    {
        return $(& $script:NewPSSessionOption -Culture 'en-US' -UICulture 'en-US' -CancelTimeOut 60000 -IdleTimeOut -1 -OpenTimeOut 180000 -OperationTimeOut 180000 )
    }
}

$script:PSSession = $null

function Get-PSImplicitRemotingModuleName { $myInvocation.MyCommand.ScriptBlock.File }

function Set-PSImplicitRemotingSession
{
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [AllowNull()]
        [Management.Automation.Runspaces.PSSession]
        $PSSession,

        [Parameter(Mandatory = $false, Position = 1)]
        [bool] $createdByModule = $false)

    if ($null -ne $PSSession)
    {
        $script:PSSession = $PSSession

        if ($createdByModule -and ($null -ne $script:PSSession))
        {
            $moduleName = Get-PSImplicitRemotingModuleName
            $script:PSSession.Name = 'Session for implicit remoting module at {0}' -f $moduleName

            $oldCleanUpScript = $script:MyModule.OnRemove
            $removePSSessionCommand = $script:RemovePSSession
            $script:MyModule.OnRemove = {
                & $removePSSessionCommand -Session $PSSession -ErrorAction SilentlyContinue
                if ($oldCleanUpScript)
                {
                    & $oldCleanUpScript $args
                }
            }.GetNewClosure()
        }
    }
}

if ($PSSessionOverride) { Set-PSImplicitRemotingSession $PSSessionOverride }

function Get-PSImplicitRemotingSession
{
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [string]
        $commandName
    )

    $savedImplicitRemotingHash = ''

    if (($null -eq $script:PSSession) -or ($script:PSSession.Runspace.RunspaceStateInfo.State -ne 'Opened'))
    {
        Set-PSImplicitRemotingSession `
            (& $script:GetPSSession `
                -InstanceId 1720fa45-8088-4d70-9b4d-bc0b9f415d30 `
                -ErrorAction SilentlyContinue )
    }

    if (($null -ne $script:PSSession) -and ($script:PSSession.Runspace.RunspaceStateInfo.State -eq 'Disconnected'))
    {
        # If we are handed a disconnected session, try re-connecting it before creating a new session.
        Set-PSImplicitRemotingSession `
            (& $script:ConnectPSSession `
                -Session $script:PSSession `
                -ErrorAction SilentlyContinue)
    }

    if (($null -eq $script:PSSession) -or ($script:PSSession.Runspace.RunspaceStateInfo.State -ne 'Opened'))
    {
        Write-PSImplicitRemotingMessage ('Creating a new session for implicit remoting of "{0}" command...' -f $commandName)

        Set-PSImplicitRemotingSession `
            -CreatedByModule $true `
            -PSSession ( 
            $(
                & $script:NewPSSession `
                     -ConfigurationName '' `
                    -SessionOption (Get-PSImplicitRemotingSessionOption) `
                     `
                    -CertificateThumbprint '' `
                     `
                     `
            )
 )

        if ($savedImplicitRemotingHash -ne '')
        {
            $newImplicitRemotingHash = [string]($script:PSSession.ApplicationPrivateData.ImplicitRemoting.Hash)
            if ($newImplicitRemotingHash -ne $savedImplicitRemotingHash)
            {
                & $script:WriteWarning -Message 'Commands that are available in the new remote session are different than those available when the implicit remoting module was created.  Consider creating the module again by using the Export-PSSession cmdlet.'
            }
        }

        
            try {
                & $script:InvokeCommand -Session $script:PSSession -ScriptBlock {
                    Get-Module -ListAvailable -Name 'ConfigDefender' | Import-Module
                } -ErrorAction SilentlyContinue
            } catch { }

    }

    if (($null -eq $script:PSSession) -or ($script:PSSession.Runspace.RunspaceStateInfo.State -ne 'Opened'))
    {
        throw 'No session has been associated with this implicit remoting module.'
    }

    return [Management.Automation.Runspaces.PSSession]$script:PSSession
}

function Modify-PSImplicitRemotingParameters
{
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [hashtable]
        $clientSideParameters,

        [Parameter(Mandatory = $true, Position = 1)]
        $PSBoundParameters,

        [Parameter(Mandatory = $true, Position = 2)]
        [string]
        $parameterName,

        [Parameter()]
        [switch]
        $leaveAsRemoteParameter)

    if ($PSBoundParameters.ContainsKey($parameterName))
    {
        $clientSideParameters.Add($parameterName, $PSBoundParameters[$parameterName])
        if (-not $leaveAsRemoteParameter) {
            $null = $PSBoundParameters.Remove($parameterName)
        }
    }
}

function Get-PSImplicitRemotingClientSideParameters
{
    param(
        [Parameter(Mandatory = $true, Position = 1)]
        $PSBoundParameters,

        [Parameter(Mandatory = $true, Position = 2)]
        $proxyForCmdlet)

    $clientSideParameters = @{}

    $parametersToLeaveRemote = 'ErrorAction', 'WarningAction', 'InformationAction', 'ProgressAction'

    Modify-PSImplicitRemotingParameters $clientSideParameters $PSBoundParameters 'AsJob'
    if ($proxyForCmdlet)
    {
        foreach($parameter in [System.Management.Automation.Cmdlet]::CommonParameters)
        {
            if($parametersToLeaveRemote -contains $parameter)
            {
                Modify-PSImplicitRemotingParameters $clientSideParameters $PSBoundParameters $parameter -LeaveAsRemoteParameter
            }
            else
            {
                Modify-PSImplicitRemotingParameters $clientSideParameters $PSBoundParameters $parameter
            }
        }
    }

    return $clientSideParameters
}

##############################################################################

& $script:SetItem 'function:script:Add-MpPreference' `
{
    param(
    
    [Alias('ob')]
    ${OutBuffer},

    [Alias('iv')]
    ${InformationVariable},

    ${ExclusionProcess},

    [Alias('bfpe')]
    ${BruteForceProtectionExclusions},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('pv')]
    ${PipelineVariable},

    ${AttackSurfaceReductionRules_Ids},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions},

    [switch]
    ${Force},

    ${AttackSurfaceReductionRules_Actions},

    [Alias('wa')]
    ${WarningAction},

    [Alias('Session')]
    ${CimSession},

    [Alias('tiddefaca')]
    ${ThreatIDDefaultAction_Actions},

    ${AttackSurfaceReductionOnlyExclusions},

    ${ExclusionExtension},

    ${ControlledFolderAccessProtectedFolders},

    [Alias('infa')]
    ${InformationAction},

    [Alias('db')]
    [switch]
    ${Debug},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('ov')]
    ${OutVariable},

    ${ExclusionIpAddress},

    [Alias('tiddefaci')]
    ${ThreatIDDefaultAction_Ids},

    ${ControlledFolderAccessAllowedApplications},

    [switch]
    ${AsJob},

    ${ThrottleLimit},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('repe')]
    ${RemoteEncryptionProtectionExclusions},

    ${ExclusionPath},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions_Id})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Add-MpPreference') `
                    -Arg ('Add-MpPreference', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Add-MpPreference
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpBehavioralNetworkBlockingRules' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    ${IpAddress},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    ${CreatedAfter},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${Type},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpBehavioralNetworkBlockingRules') `
                    -Arg ('Get-MpBehavioralNetworkBlockingRules', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpBehavioralNetworkBlockingRules
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpComputerStatus' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpComputerStatus') `
                    -Arg ('Get-MpComputerStatus', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpComputerStatus
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpPreference' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpPreference') `
                    -Arg ('Get-MpPreference', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpPreference
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpThreat' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('ID')]
    ${ThreatID},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpThreat') `
                    -Arg ('Get-MpThreat', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpThreat
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpThreatCatalog' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('ID')]
    ${ThreatID},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpThreatCatalog') `
                    -Arg ('Get-MpThreatCatalog', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpThreatCatalog
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Get-MpThreatDetection' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('ID')]
    ${ThreatID},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Get-MpThreatDetection') `
                    -Arg ('Get-MpThreatDetection', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Get-MpThreatDetection
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Remove-MpBehavioralNetworkBlockingRules' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    ${FilterGUID},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Remove-MpBehavioralNetworkBlockingRules') `
                    -Arg ('Remove-MpBehavioralNetworkBlockingRules', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Remove-MpBehavioralNetworkBlockingRules
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Remove-MpPreference' `
{
    param(
    
    [Alias('rst')]
    [switch]
    ${RemediationScheduleTime},

    [switch]
    ${AsJob},

    [Alias('repcs')]
    [switch]
    ${RemoteEncryptionProtectionConfiguredState},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions_Id},

    [Alias('ppurl')]
    [switch]
    ${ProxyPacUrl},

    [Alias('ltdefac')]
    [switch]
    ${LowThreatDefaultAction},

    [Alias('scsqst')]
    [switch]
    ${ScanScheduleQuickScanTime},

    [Alias('dicf')]
    [switch]
    ${DisableInboundConnectionFiltering},

    [Alias('euso')]
    [switch]
    ${EnableUdpSegmentationOffload},

    [switch]
    ${SubmitSamplesConsent},

    [Alias('sigduoswo')]
    [switch]
    ${SignatureDisableUpdateOnStartupWithoutEngine},

    [Alias('htdefac')]
    [switch]
    ${HighThreatDefaultAction},

    [Alias('bfpe')]
    ${BruteForceProtectionExclusions},

    [Alias('pec')]
    [switch]
    ${PromptEvidenceCollection},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('duc')]
    [switch]
    ${DefinitionUpdatesChannel},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ddtgp')]
    [switch]
    ${DisableDatagramProcessing},

    [Alias('spiad')]
    [switch]
    ${ScanPurgeItemsAfterDelay},

    [Alias('adsnftioav')]
    [switch]
    ${ApplyDisableNetworkScanningToIOAV},

    [Alias('sfo')]
    [switch]
    ${SignatureFallbackOrder},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('wv')]
    ${WarningVariable},

    ${ExclusionPath},

    [Alias('itdte')]
    [switch]
    ${IntelTDTEnabled},

    [Alias('anpws')]
    [switch]
    ${AllowNetworkProtectionOnWinServer},

    ${ExclusionExtension},

    [Alias('euc')]
    [switch]
    ${EngineUpdatesChannel},

    [Alias('mtdefac')]
    [switch]
    ${ModerateThreatDefaultAction},

    [Alias('ani')]
    [switch]
    ${AiAgentNetworkInspection},

    [Alias('dsmtpp')]
    [switch]
    ${DisableSmtpParsing},

    [Alias('rstpc')]
    [switch]
    ${RemoveScanningThreadPoolCap},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('bfpcs')]
    [switch]
    ${BruteForceProtectionConfiguredState},

    [Alias('soiie')]
    [switch]
    ${ScanOnlyIfIdleEnabled},

    [Alias('dbaf')]
    [switch]
    ${DisableBlockAtFirstSeen},

    [Alias('sigfagp')]
    [switch]
    ${SignatureFirstAuGracePeriod},

    [Alias('astai')]
    [switch]
    ${AllowSwitchToAsyncInspection},

    [Alias('dscrptsc')]
    [switch]
    ${DisableScriptScanning},

    ${AttackSurfaceReductionRules_Actions},

    [Alias('tiddefaca')]
    ${ThreatIDDefaultAction_Actions},

    [Alias('dsshp')]
    [switch]
    ${DisableSshParsing},

    [Alias('dcst')]
    [switch]
    ${DisableCoreServiceTelemetry},

    [Alias('darchsc')]
    [switch]
    ${DisableArchiveScanning},

    [Alias('euro')]
    [switch]
    ${EnableUdpReceiveOffload},

    ${AttackSurfaceReductionRules_Ids},

    [Alias('dbm')]
    [switch]
    ${DisableBehaviorMonitoring},

    [Alias('dcqsc')]
    [switch]
    ${DisableCatchupQuickScan},

    [Alias('oobers')]
    [switch]
    ${OobeEnableRtpAndSigUpdate},

    [switch]
    ${DisableCpuThrottleOnIdleScans},

    ${ThrottleLimit},

    [Alias('epi')]
    [switch]
    ${EnablePackageInspection},

    [Alias('tiddefaci')]
    ${ThreatIDDefaultAction_Ids},

    ${ControlledFolderAccessProtectedFolders},

    [Alias('sigbui')]
    [switch]
    ${SignatureBlobUpdateInterval},

    [Alias('unktdefac')]
    [switch]
    ${UnknownThreatDefaultAction},

    [Alias('dtdtf')]
    [switch]
    ${DisableTDTFeature},

    [Alias('db')]
    [switch]
    ${Debug},

    [Alias('dcm')]
    [switch]
    ${DisableCacheMaintenance},

    [Alias('tlps')]
    [switch]
    ${TrustLabelProtectionStatus},

    [Alias('infa')]
    ${InformationAction},

    [Alias('saclf')]
    [switch]
    ${ScanAvgCPULoadFactor},

    [Alias('raat')]
    [switch]
    ${ReportingAdditionalActionTimeOut},

    [Alias('dsmndfsc')]
    [switch]
    ${DisableScanningMappedNetworkDrivesForFullScan},

    [Alias('dhttpp')]
    [switch]
    ${DisableHttpParsing},

    [Alias('repe')]
    ${RemoteEncryptionProtectionExclusions},

    ${ExclusionProcess},

    [Alias('dgr')]
    [switch]
    ${DisableGradualRelease},

    [Alias('rncto')]
    [switch]
    ${ReportingNonCriticalTimeOut},

    ${ControlledFolderAccessAllowedApplications},

    [Alias('ednss')]
    [switch]
    ${EnableDnsSinkhole},

    [Alias('dc')]
    [switch]
    ${DeploymentChannel},

    [Alias('dnppt')]
    [switch]
    ${DisableNetworkProtectionPerfTelemetry},

    [Alias('drp')]
    [switch]
    ${DisableRestorePoint},

    [Alias('anpdl')]
    [switch]
    ${AllowNetworkProtectionDownLevel},

    [Alias('fupo')]
    [switch]
    ${ForceUseProxyOnly},

    [Alias('nprepmode')]
    [switch]
    ${NetworkProtectionReputationMode},

    [Alias('ov')]
    ${OutVariable},

    ${ExclusionIpAddress},

    [Alias('rsd')]
    [switch]
    ${RemediationScheduleDay},

    [Alias('dsnf')]
    [switch]
    ${DisableScanningNetworkFiles},

    [Alias('dioavp')]
    [switch]
    ${DisableIOAVProtection},

    [Alias('sigsd')]
    [switch]
    ${SignatureScheduleDay},

    [Alias('ddnsp')]
    [switch]
    ${DisableDnsParsing},

    [switch]
    ${EnableNetworkProtection},

    [Alias('dips')]
    [switch]
    ${DisableIntrusionPreventionSystem},

    [Alias('cloudextimeout')]
    [switch]
    ${CloudExtendedTimeout},

    [Alias('sigui')]
    [switch]
    ${SignatureUpdateInterval},

    [Alias('proxbps')]
    [switch]
    ${ProxyBypass},

    [Alias('repa')]
    [switch]
    ${RemoteEncryptionProtectionAggressiveness},

    [Alias('sigagp')]
    [switch]
    ${SignatureAuGracePeriod},

    [Alias('ecwtb')]
    [switch]
    ${EnableConvertWarnToBlock},

    [Alias('efsobp')]
    [switch]
    ${EnableFullScanOnBatteryPower},

    [Alias('srt')]
    [switch]
    ${SchedulerRandomizationTime},

    [Alias('bfpslp')]
    [switch]
    ${BruteForceProtectionSkipLearningPeriod},

    [Alias('rstt')]
    [switch]
    ${RandomizeScheduleTaskTimes},

    [Alias('csbr')]
    [switch]
    ${CheckForSignaturesBeforeRunningScan},

    [Alias('adpows')]
    [switch]
    ${AllowDatagramProcessingOnWinServer},

    [Alias('sigdufss')]
    [switch]
    ${SignatureDefinitionUpdateFileSharesSources},

    [Alias('mcupd')]
    [switch]
    ${MeteredConnectionUpdates},

    [Alias('repmbt')]
    [switch]
    ${RemoteEncryptionProtectionMaxBlockTime},

    [Alias('siguci')]
    [switch]
    ${SignatureUpdateCatchupInterval},

    [Alias('rtsd')]
    [switch]
    ${RealTimeScanDirection},

    [Alias('drtm')]
    [switch]
    ${DisableRealtimeMonitoring},

    [Alias('dftpp')]
    [switch]
    ${DisableFtpParsing},

    [Alias('bfplnb')]
    [switch]
    ${BruteForceProtectionLocalNetworkBlocking},

    [Alias('bfpmbt')]
    [switch]
    ${BruteForceProtectionMaxBlockTime},

    [Alias('dtlsp')]
    [switch]
    ${DisableTlsParsing},

    [Alias('sigbfs')]
    [switch]
    ${SignatureBlobFileSharesSources},

    [Alias('ap')]
    [switch]
    ${AiAgentProtection},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [switch]
    ${ScanParameters},

    [switch]
    ${EnableControlledFolderAccess},

    [Alias('drdpp')]
    [switch]
    ${DisableRdpParsing},

    [Alias('qsie')]
    [switch]
    ${QuickScanIncludeExclusions},

    [Alias('scsd')]
    [switch]
    ${ScanScheduleDay},

    [Alias('elcp')]
    [switch]
    ${EnableLowCpuPriority},

    [Alias('rcto')]
    [switch]
    ${ReportingCriticalFailureTimeOut},

    [switch]
    ${UILockdown},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions},

    [Alias('scso')]
    [switch]
    ${ScanScheduleOffset},

    [Alias('stdefac')]
    [switch]
    ${SevereThreatDefaultAction},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('rdsde')]
    [switch]
    ${ReportDynamicSignatureDroppedEvent},

    [Alias('dpm')]
    [switch]
    ${DisablePrivacyMode},

    [switch]
    ${MAPSReporting},

    [Alias('proxsrv')]
    [switch]
    ${ProxyServer},

    [Alias('efhc')]
    [switch]
    ${EnableFileHashComputation},

    [Alias('ssp','SecurityIntelligenceLocation','ssl')]
    [switch]
    ${SharedSignaturesPath},

    [Alias('sigst')]
    [switch]
    ${SignatureScheduleTime},

    [Alias('drdsc')]
    [switch]
    ${DisableRemovableDriveScanning},

    [Alias('dquicp')]
    [switch]
    ${DisableQuicParsing},

    [Alias('demsc')]
    [switch]
    ${DisableEmailScanning},

    [Alias('sspsch','SecurityIntelligenceLocationUpdateAtScheduledTimeOnly')]
    [switch]
    ${SharedSignaturesPathUpdateAtScheduledTimeOnly},

    [Alias('qpiad')]
    [switch]
    ${QuarantinePurgeItemsAfterDelay},

    [Alias('scst')]
    [switch]
    ${ScanScheduleTime},

    [Alias('bfpa')]
    [switch]
    ${BruteForceProtectionAggressiveness},

    ${AttackSurfaceReductionOnlyExclusions},

    [Alias('puc')]
    [switch]
    ${PlatformUpdatesChannel},

    [switch]
    ${PUAProtection},

    [Alias('Session')]
    ${CimSession},

    [Alias('pms')]
    [switch]
    ${PerformanceModeStatus},

    [Alias('dae')]
    [switch]
    ${DisableAutoExclusions},

    [Alias('shri')]
    [switch]
    ${ServiceHealthReportInterval},

    [Alias('dcfsc')]
    [switch]
    ${DisableCatchupFullScan},

    [Alias('ddnstcpp')]
    [switch]
    ${DisableDnsOverTcpParsing},

    [switch]
    ${Force},

    [Alias('ob')]
    ${OutBuffer},

    [Alias('tfsso')]
    [switch]
    ${ThrottleForScheduledScanOnly},

    [Alias('dcsei')]
    [switch]
    ${DisableCoreServiceECSIntegration},

    [switch]
    ${CloudBlockLevel})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Remove-MpPreference') `
                    -Arg ('Remove-MpPreference', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Remove-MpPreference
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Remove-MpThreat' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Remove-MpThreat') `
                    -Arg ('Remove-MpThreat', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Remove-MpThreat
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Set-MpPreference' `
{
    param(
    
    [Alias('rst')]
    ${RemediationScheduleTime},

    [switch]
    ${AsJob},

    [Alias('repcs')]
    ${RemoteEncryptionProtectionConfiguredState},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions_Id},

    [Alias('ppurl')]
    ${ProxyPacUrl},

    [Alias('ltdefac')]
    ${LowThreatDefaultAction},

    [Alias('scsqst')]
    ${ScanScheduleQuickScanTime},

    [Alias('dicf')]
    ${DisableInboundConnectionFiltering},

    [Alias('euso')]
    ${EnableUdpSegmentationOffload},

    ${SubmitSamplesConsent},

    [Alias('sigduoswo')]
    ${SignatureDisableUpdateOnStartupWithoutEngine},

    [Alias('htdefac')]
    ${HighThreatDefaultAction},

    [Alias('bfpe')]
    ${BruteForceProtectionExclusions},

    [Alias('pec')]
    ${PromptEvidenceCollection},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('duc')]
    ${DefinitionUpdatesChannel},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ddtgp')]
    ${DisableDatagramProcessing},

    [Alias('spiad')]
    ${ScanPurgeItemsAfterDelay},

    [Alias('adsnftioav')]
    ${ApplyDisableNetworkScanningToIOAV},

    [Alias('sfo')]
    ${SignatureFallbackOrder},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('wv')]
    ${WarningVariable},

    ${ExclusionPath},

    [Alias('itdte')]
    ${IntelTDTEnabled},

    [Alias('anpws')]
    ${AllowNetworkProtectionOnWinServer},

    ${ExclusionExtension},

    [Alias('euc')]
    ${EngineUpdatesChannel},

    [Alias('mtdefac')]
    ${ModerateThreatDefaultAction},

    [Alias('ani')]
    ${AiAgentNetworkInspection},

    [Alias('dsmtpp')]
    ${DisableSmtpParsing},

    [Alias('rstpc')]
    ${RemoveScanningThreadPoolCap},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('bfpcs')]
    ${BruteForceProtectionConfiguredState},

    [Alias('soiie')]
    ${ScanOnlyIfIdleEnabled},

    [Alias('dbaf')]
    ${DisableBlockAtFirstSeen},

    [Alias('sigfagp')]
    ${SignatureFirstAuGracePeriod},

    [Alias('astai')]
    ${AllowSwitchToAsyncInspection},

    [Alias('dscrptsc')]
    ${DisableScriptScanning},

    ${AttackSurfaceReductionRules_Actions},

    [Alias('tiddefaca')]
    ${ThreatIDDefaultAction_Actions},

    [Alias('dsshp')]
    ${DisableSshParsing},

    [Alias('dcst')]
    ${DisableCoreServiceTelemetry},

    [Alias('darchsc')]
    ${DisableArchiveScanning},

    [Alias('euro')]
    ${EnableUdpReceiveOffload},

    ${AttackSurfaceReductionRules_Ids},

    [Alias('dbm')]
    ${DisableBehaviorMonitoring},

    [Alias('dcqsc')]
    ${DisableCatchupQuickScan},

    [Alias('oobers')]
    ${OobeEnableRtpAndSigUpdate},

    ${DisableCpuThrottleOnIdleScans},

    ${ThrottleLimit},

    [Alias('epi')]
    ${EnablePackageInspection},

    [Alias('tiddefaci')]
    ${ThreatIDDefaultAction_Ids},

    ${ControlledFolderAccessProtectedFolders},

    [Alias('sigbui')]
    ${SignatureBlobUpdateInterval},

    [Alias('unktdefac')]
    ${UnknownThreatDefaultAction},

    [Alias('dtdtf')]
    ${DisableTDTFeature},

    [Alias('db')]
    [switch]
    ${Debug},

    [Alias('dcm')]
    ${DisableCacheMaintenance},

    [Alias('tlps')]
    ${TrustLabelProtectionStatus},

    [Alias('infa')]
    ${InformationAction},

    [Alias('saclf')]
    ${ScanAvgCPULoadFactor},

    [Alias('raat')]
    ${ReportingAdditionalActionTimeOut},

    [Alias('dsmndfsc')]
    ${DisableScanningMappedNetworkDrivesForFullScan},

    [Alias('dhttpp')]
    ${DisableHttpParsing},

    [Alias('repe')]
    ${RemoteEncryptionProtectionExclusions},

    ${ExclusionProcess},

    [Alias('dgr')]
    ${DisableGradualRelease},

    [Alias('rncto')]
    ${ReportingNonCriticalTimeOut},

    ${ControlledFolderAccessAllowedApplications},

    [Alias('ednss')]
    ${EnableDnsSinkhole},

    [Alias('dc')]
    ${DeploymentChannel},

    [Alias('dnppt')]
    ${DisableNetworkProtectionPerfTelemetry},

    [Alias('drp')]
    ${DisableRestorePoint},

    [Alias('anpdl')]
    ${AllowNetworkProtectionDownLevel},

    [Alias('fupo')]
    ${ForceUseProxyOnly},

    [Alias('nprepmode')]
    ${NetworkProtectionReputationMode},

    [Alias('ov')]
    ${OutVariable},

    ${ExclusionIpAddress},

    [Alias('rsd')]
    ${RemediationScheduleDay},

    [Alias('dsnf')]
    ${DisableScanningNetworkFiles},

    [Alias('dioavp')]
    ${DisableIOAVProtection},

    [Alias('sigsd')]
    ${SignatureScheduleDay},

    [Alias('ddnsp')]
    ${DisableDnsParsing},

    ${EnableNetworkProtection},

    [Alias('dips')]
    ${DisableIntrusionPreventionSystem},

    [Alias('cloudextimeout')]
    ${CloudExtendedTimeout},

    [Alias('sigui')]
    ${SignatureUpdateInterval},

    [Alias('proxbps')]
    ${ProxyBypass},

    [Alias('repa')]
    ${RemoteEncryptionProtectionAggressiveness},

    [Alias('sigagp')]
    ${SignatureAuGracePeriod},

    [Alias('ecwtb')]
    ${EnableConvertWarnToBlock},

    [Alias('dtp')]
    ${DisableTamperProtection},

    [Alias('efsobp')]
    ${EnableFullScanOnBatteryPower},

    [Alias('srt')]
    ${SchedulerRandomizationTime},

    [Alias('bfpslp')]
    ${BruteForceProtectionSkipLearningPeriod},

    [Alias('rstt')]
    ${RandomizeScheduleTaskTimes},

    [Alias('csbr')]
    ${CheckForSignaturesBeforeRunningScan},

    [Alias('adpows')]
    ${AllowDatagramProcessingOnWinServer},

    [Alias('sigdufss')]
    ${SignatureDefinitionUpdateFileSharesSources},

    [Alias('mcupd')]
    ${MeteredConnectionUpdates},

    [Alias('repmbt')]
    ${RemoteEncryptionProtectionMaxBlockTime},

    [Alias('siguci')]
    ${SignatureUpdateCatchupInterval},

    [Alias('rtsd')]
    ${RealTimeScanDirection},

    [Alias('drtm')]
    ${DisableRealtimeMonitoring},

    [Alias('dftpp')]
    ${DisableFtpParsing},

    [Alias('bfplnb')]
    ${BruteForceProtectionLocalNetworkBlocking},

    [Alias('bfpmbt')]
    ${BruteForceProtectionMaxBlockTime},

    [Alias('dtlsp')]
    ${DisableTlsParsing},

    [Alias('sigbfs')]
    ${SignatureBlobFileSharesSources},

    [Alias('ap')]
    ${AiAgentProtection},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ScanParameters},

    ${EnableControlledFolderAccess},

    [Alias('drdpp')]
    ${DisableRdpParsing},

    [Alias('qsie')]
    ${QuickScanIncludeExclusions},

    [Alias('scsd')]
    ${ScanScheduleDay},

    [Alias('elcp')]
    ${EnableLowCpuPriority},

    [Alias('rcto')]
    ${ReportingCriticalFailureTimeOut},

    ${UILockdown},

    ${AttackSurfaceReductionRules_RuleSpecificExclusions},

    [Alias('scso')]
    ${ScanScheduleOffset},

    [Alias('stdefac')]
    ${SevereThreatDefaultAction},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('rdsde')]
    ${ReportDynamicSignatureDroppedEvent},

    [Alias('dpm')]
    ${DisablePrivacyMode},

    ${MAPSReporting},

    [Alias('proxsrv')]
    ${ProxyServer},

    [Alias('efhc')]
    ${EnableFileHashComputation},

    [Alias('ssp','SecurityIntelligenceLocation','ssl')]
    ${SharedSignaturesPath},

    [Alias('sigst')]
    ${SignatureScheduleTime},

    [Alias('drdsc')]
    ${DisableRemovableDriveScanning},

    [Alias('dquicp')]
    ${DisableQuicParsing},

    [Alias('demsc')]
    ${DisableEmailScanning},

    [Alias('sspsch','SecurityIntelligenceLocationUpdateAtScheduledTimeOnly')]
    ${SharedSignaturesPathUpdateAtScheduledTimeOnly},

    [Alias('qpiad')]
    ${QuarantinePurgeItemsAfterDelay},

    [Alias('scst')]
    ${ScanScheduleTime},

    [Alias('bfpa')]
    ${BruteForceProtectionAggressiveness},

    ${AttackSurfaceReductionOnlyExclusions},

    [Alias('puc')]
    ${PlatformUpdatesChannel},

    ${PUAProtection},

    [Alias('Session')]
    ${CimSession},

    [Alias('pms')]
    ${PerformanceModeStatus},

    [Alias('dae')]
    ${DisableAutoExclusions},

    [Alias('shri')]
    ${ServiceHealthReportInterval},

    [Alias('dcfsc')]
    ${DisableCatchupFullScan},

    [Alias('ddnstcpp')]
    ${DisableDnsOverTcpParsing},

    [switch]
    ${Force},

    [Alias('ob')]
    ${OutBuffer},

    [Alias('tfsso')]
    ${ThrottleForScheduledScanOnly},

    [Alias('dcsei')]
    ${DisableCoreServiceECSIntegration},

    ${CloudBlockLevel})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Set-MpPreference') `
                    -Arg ('Set-MpPreference', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Set-MpPreference
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Start-MpRollback' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [switch]
    ${Engine},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [switch]
    ${Platform},

    [Alias('infa')]
    ${InformationAction},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('Session')]
    ${CimSession},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Start-MpRollback') `
                    -Arg ('Start-MpRollback', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Start-MpRollback
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Start-MpScan' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    ${ScanPath},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('vb')]
    [switch]
    ${Verbose},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ov')]
    ${OutVariable},

    ${ScanType},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Start-MpScan') `
                    -Arg ('Start-MpScan', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Start-MpScan
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Start-MpWDOScan' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Start-MpWDOScan') `
                    -Arg ('Start-MpWDOScan', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Start-MpWDOScan
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
& $script:SetItem 'function:script:Update-MpSignature' `
{
    param(
    
    [Alias('db')]
    [switch]
    ${Debug},

    [switch]
    ${AsJob},

    [Alias('wv')]
    ${WarningVariable},

    [Alias('ev')]
    ${ErrorVariable},

    [Alias('Session')]
    ${CimSession},

    [Alias('infa')]
    ${InformationAction},

    [Alias('vb')]
    [switch]
    ${Verbose},

    ${ThrottleLimit},

    [Alias('pv')]
    ${PipelineVariable},

    [Alias('iv')]
    ${InformationVariable},

    [Alias('ov')]
    ${OutVariable},

    ${UpdateSource},

    [Alias('wa')]
    ${WarningAction},

    [Alias('ea')]
    ${ErrorAction},

    [Alias('ob')]
    ${OutBuffer})

    Begin {
        try {
            $positionalArguments = & $script:NewObject collections.arraylist
            foreach ($parameterName in $PSBoundParameters.BoundPositionally)
            {
                $null = $positionalArguments.Add( $PSBoundParameters[$parameterName] )
                $null = $PSBoundParameters.Remove($parameterName)
            }

            $positionalArguments.AddRange($args)

            $clientSideParameters = Get-PSImplicitRemotingClientSideParameters $PSBoundParameters $True

            $scriptCmd = {
                & $script:InvokeCommand `
                    @clientSideParameters `
                    -HideComputerName `
                    -Session (Get-PSImplicitRemotingSession -CommandName 'Update-MpSignature') `
                    -Arg ('Update-MpSignature', $PSBoundParameters, $positionalArguments) `
                    -Script { param($name, $boundParams, $unboundParams) & $name @boundParams @unboundParams } `
            }

            $steppablePipeline = $scriptCmd.GetSteppablePipeline($myInvocation.CommandOrigin)
            $steppablePipeline.Begin($myInvocation.ExpectingInput, $ExecutionContext)
        } catch {
            throw
        }
    }

    Process { 
    try {
        $steppablePipeline.Process($_)
    } catch {
        throw
    }
 }

    End { 
    try {
        $steppablePipeline.End()
    } catch {
        throw
    }
 }

    # .ForwardHelpTargetName Update-MpSignature
    # .ForwardHelpCategory Function
    # .RemoteHelpRunspace PSSession
}
        
##############################################################################

& $script:ExportModuleMember -Function @('Add-MpPreference', 'Get-MpBehavioralNetworkBlockingRules', 'Get-MpComputerStatus', 'Get-MpPreference', 'Get-MpThreat', 'Get-MpThreatCatalog', 'Get-MpThreatDetection', 'Remove-MpBehavioralNetworkBlockingRules', 'Remove-MpPreference', 'Remove-MpThreat', 'Set-MpPreference', 'Start-MpRollback', 'Start-MpScan', 'Start-MpWDOScan', 'Update-MpSignature')
        
##############################################################################

& $script:ExportModuleMember -Alias @()
        