using Core.DomainModel.DpsCustomer;
using Core.RepositoryInterface.IDpsCustomer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.RepositoryImplementation
{
    public class RICustomer : RIBase, IDpsCustomer
    {
        public async Task<DpsCustomer> GetCustomerByVatNumberAsync(string VatNumber)
        {
            throw new NotImplementedException();
        }
    }
}
