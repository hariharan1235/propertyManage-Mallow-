trigger caseAssignment on Case (before insert) 
{
	
    if (Trigger.isBefore && Trigger.isInsert) {
        List<User> eligibleUsers = [SELECT Id, Name 
                                  FROM User 
                                  WHERE IsActive = true 
                                  AND Profile.Name = 'Support Profile' // Example profile
                                  ORDER BY Id]; 
        
        if (eligibleUsers.isEmpty()) return;

        // Get open case counts for eligible users
        Map<Id, Integer> userCaseCounts = new Map<Id, Integer>();
        for (User u : eligibleUsers) {
            userCaseCounts.put(u.Id, 0); 
        }
        
        // Aggregate existing open cases
        for (AggregateResult ar : [SELECT OwnerId, COUNT(Id) caseCount 
                                  FROM Case 
                                  WHERE OwnerId IN :userCaseCounts.keySet() 
                                  AND IsClosed = false 
                                  GROUP BY OwnerId]) {
            Id ownerId = (Id)ar.get('OwnerId');
            userCaseCounts.put(ownerId, (Integer)ar.get('caseCount'));
        }

        // Find minimum workload
        Integer minWorkload = 200;
        for (Integer count : userCaseCounts.values()) {
            if (count < minWorkload) minWorkload = count;
        }
        
        // Get users with minimum workload
        List<User> leastBusyUsers = new List<User>();
        for (User u : eligibleUsers) {
            if (userCaseCounts.get(u.Id) == minWorkload) {
                leastBusyUsers.add(u);
            }
        }

        // Assign cases
        if (!leastBusyUsers.isEmpty()) {
            Integer index = 0;
            for (Case newCase : Trigger.new) {
                newCase.OwnerId = leastBusyUsers[Math.mod(index, leastBusyUsers.size())].Id;
                index++;
            }
        }
    }
}