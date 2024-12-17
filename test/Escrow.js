const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer,seller,inspector,lender;
    let realEstate,escrow;

    beforeEach(async()=> {
        [buyer,seller,inspector,lender] = await ethers.getSigners();
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy();
        console.log(realEstate.address);

        // Mint

        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();


        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            lender.address,
            inspector.address,
        );
        transaction = await realEstate.connect(seller).approve(escrow.address,1);
        await transaction.wait();

        transaction = await escrow.connect(seller).list(1)
        await transaction.wait();
    })

    describe('Deployment',()=> {
        it('Returns NFT address', async()=> {
            const result = await escrow.nftAddress();
            console.log(result)
            expect(result).to.be.equal(realEstate.address)
    
        })

        it('Returns Seller', async()=>{
            const result1 = await escrow.seller();
            expect(result1).to.be.equal(seller.address)
            console.log(result1)

        })
        it('Returns inspector', async()=>{
            const result1 = await escrow.inspector();
            expect(result1).to.be.equal(inspector.address)
            console.log(result1)

        })

        it('Returns lender',async()=> {
            
            const result1 = await escrow.lender();
            expect(result1).to.be.equal(lender.address)
            console.log(result1);
        })
       
    })

    describe('Listing',()=> {
        it('Updates ownership', async()=> {
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
        })
        it('updates as listed',async()=> {
            const result = await escrow.isListed(1);
            expect(result).to.be.equal(true);
        })
    })




    it('save the address',async() => {
       

       
       
    })
})